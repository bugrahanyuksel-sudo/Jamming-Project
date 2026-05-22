import io
from typing import Any, Dict, List, Tuple

import cv2
import numpy as np
import matplotlib
matplotlib.use('Agg')  # headless backend — no display required
import matplotlib.pyplot as plt

# --- CONFIGURATION & CALIBRATION ---
FREQ_MIN = 1255.0
FREQ_MAX = 1305.0

TARGET_SIGNALS = [1268.52, 1278.75]
BANDWIDTH = 20.0

# BGR colors per target signal (distinct for easy visual separation)
_TARGET_COLORS_BGR: List[Tuple[int, int, int]] = [
    (0, 0, 255),     # Red   → target 0 (1268.52 MHz)
    (0, 165, 255),   # Orange → target 1 (1278.75 MHz)
]

# Minimum contour area (pixels²) and height (pixels) to suppress noise
_MIN_CONTOUR_AREA = 6
_MIN_CONTOUR_HEIGHT = 2
# Horizontal gap (pixels) within which two boxes of the same target are merged
_MERGE_X_GAP = 12


def _get_target_index(freq: float) -> int:
    """Return 0-based target index if freq falls within a monitored band, else -1."""
    for i, target in enumerate(TARGET_SIGNALS):
        if abs(freq - target) <= BANDWIDTH:
            return i
    return -1


def get_frequency_from_pixel(x_pixel: float, plot_x_start: int, plot_x_end: int) -> float:
    if plot_x_end == plot_x_start:
        return 0.0
    ratio = (x_pixel - plot_x_start) / (plot_x_end - plot_x_start)
    return FREQ_MIN + ratio * (FREQ_MAX - FREQ_MIN)


def _merge_boxes(boxes: List[Tuple[int, int, int, int]]) -> List[Tuple[int, int, int, int]]:
    """
    Merge bounding boxes that are horizontally adjacent or overlapping.
    Boxes sorted by x; any two boxes whose x-intervals are within _MERGE_X_GAP
    pixels are combined into one enclosing rectangle.
    """
    if not boxes:
        return []
    boxes = sorted(boxes, key=lambda b: b[0])
    merged: List[Tuple[int, int, int, int]] = []
    cx1, cy1, cx2, cy2 = (boxes[0][0], boxes[0][1],
                           boxes[0][0] + boxes[0][2],
                           boxes[0][1] + boxes[0][3])
    for x, y, w, h in boxes[1:]:
        rx2 = x + w
        ry2 = y + h
        if x <= cx2 + _MERGE_X_GAP:
            # Absorb into current group
            cx1 = min(cx1, x)
            cy1 = min(cy1, y)
            cx2 = max(cx2, rx2)
            cy2 = max(cy2, ry2)
        else:
            merged.append((cx1, cy1, cx2 - cx1, cy2 - cy1))
            cx1, cy1, cx2, cy2 = x, y, rx2, ry2
    merged.append((cx1, cy1, cx2 - cx1, cy2 - cy1))
    return merged


def _build_hot_mask(hsv: np.ndarray) -> np.ndarray:
    """
    Return a binary mask of 'hot' spectrogram pixels using three HSV ranges:
      • Red-orange-yellow  (hue   0–35)         — most common jamming signature
      • Green-cyan         (hue  40–90, high S/V) — mid-intensity on jet colormap
      • Red wraparound     (hue 160–180)         — catches pure-red spikes
    Higher saturation/value floor (80) reduces false positives from dim colours.
    """
    m1 = cv2.inRange(hsv, np.array([0,   80,  80]),  np.array([35,  255, 255]))
    # Extended hue to 100 and lowered S/V floor to 65/80 to capture faint cyan artifacts
    m2 = cv2.inRange(hsv, np.array([40,   65,  80]),  np.array([100, 255, 255]))
    m3 = cv2.inRange(hsv, np.array([160,  80,  80]),  np.array([180, 255, 255]))
    # Exclude the blue background (hue ~110–130) by masking out that band from m2
    blue_bg = cv2.inRange(hsv, np.array([105, 40, 60]), np.array([135, 255, 255]))
    m2 = cv2.bitwise_and(m2, cv2.bitwise_not(blue_bg))
    return cv2.bitwise_or(cv2.bitwise_or(m1, m2), m3)


def _process_image(img: np.ndarray) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """
    Core detection logic.

    Parameters
    ----------
    img : BGR numpy array (the raw spectrogram)

    Returns
    -------
    output_img : annotated BGR array
    mask_viz   : coloured detection-mask BGR array (same size as img)
    summary    : structured detection summary for API/tool consumption
    """
    output_img = img.copy()
    height, width = img.shape[:2]

    if width < 260 or height < 120:
        raise ValueError("Image is too small for calibrated spectrogram detection.")

    # --- CALIBRATION ---
    PLOT_X_START = 60
    PLOT_X_END = width - 150

    roi_y1, roi_y2 = 40, height - 60
    if PLOT_X_END <= PLOT_X_START or roi_y2 <= roi_y1:
        raise ValueError("Image dimensions are incompatible with the detector calibration window.")

    plot_area = img[roi_y1:roi_y2, PLOT_X_START:PLOT_X_END]

    hsv = cv2.cvtColor(plot_area, cv2.COLOR_BGR2HSV)
    mask = _build_hot_mask(hsv)

    # Morphology pipeline:
    #  1. OPEN (1×1 / single pass) — removes single-pixel salt noise only,
    #     preserving tiny 2–3 px artifact blobs that are genuine weak signals.
    #  2. CLOSE (3×3, 1 pass) — seals small intra-blob gaps without
    #     merging spatially separate events into one giant blob.
    kernel_open  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel_open,  iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close, iterations=1)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Bucket raw detections by target index before drawing
    buckets: dict[int, List[Tuple[int, int, int, int]]] = {
        i: [] for i in range(len(TARGET_SIGNALS))
    }

    for cnt in contours:
        if cv2.contourArea(cnt) < _MIN_CONTOUR_AREA:
            continue
        x, y, w, h = cv2.boundingRect(cnt)
        if h < _MIN_CONTOUR_HEIGHT:
            continue

        true_x = x + PLOT_X_START
        true_y = y + roi_y1
        center_x = true_x + w / 2
        freq = get_frequency_from_pixel(center_x, PLOT_X_START, PLOT_X_END)

        idx = _get_target_index(freq)
        if idx >= 0:
            buckets[idx].append((true_x, true_y, w, h))

    merged_counts: Dict[int, int] = {i: 0 for i in range(len(TARGET_SIGNALS))}
    strength_buckets: Dict[int, List[int]] = {i: [] for i in range(len(TARGET_SIGNALS))}

    # Draw merged boxes with per-target colour and signal-strength label
    for idx, raw_boxes in buckets.items():
        if not raw_boxes:
            continue

        color = _TARGET_COLORS_BGR[idx % len(_TARGET_COLORS_BGR)]
        target_freq = TARGET_SIGNALS[idx]
        placed_label_ys: List[int] = []

        for (tx, ty, tw, th) in _merge_boxes(raw_boxes):
            merged_counts[idx] += 1
            cv2.rectangle(output_img, (tx, ty), (tx + tw, ty + th), color, 2)

            # Estimate signal strength as mean brightness of the detection patch
            patch = img[ty:ty + th, tx:tx + tw]
            strength = int(cv2.mean(cv2.cvtColor(patch, cv2.COLOR_BGR2GRAY))[0] / 255 * 100) if patch.size else 0
            strength_buckets[idx].append(strength)

            label = f"{target_freq:.2f} MHz  pwr~{strength}%"

            # Position label to the right; flip left if it would overflow
            approx_label_w = len(label) * 6
            lx = tx + tw + 4
            if lx + approx_label_w > width:
                lx = max(0, tx - approx_label_w - 4)

            # Nudge label down until it doesn't collide with a previously placed one
            ly = ty + 10
            while any(abs(ly - py) < 13 for py in placed_label_ys):
                ly += 13
            placed_label_ys.append(ly)

            cv2.putText(output_img, label, (lx, ly),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.35, color, 1, cv2.LINE_AA)

    # Build a coloured mask overlay for the third visualisation panel
    mask_viz = np.zeros_like(img)
    mask_viz[roi_y1:roi_y2, PLOT_X_START:PLOT_X_END] = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

    roi_area = max(1, (roi_y2 - roi_y1) * (PLOT_X_END - PLOT_X_START))
    hot_pixels = int(cv2.countNonZero(mask))

    per_target: List[Dict[str, Any]] = []
    for i, target_freq in enumerate(TARGET_SIGNALS):
        strengths = strength_buckets[i]
        per_target.append({
            "targetFrequencyMHz": float(target_freq),
            "rawDetections": len(buckets[i]),
            "mergedDetections": int(merged_counts[i]),
            "avgSignalStrengthPercent": round(float(sum(strengths) / len(strengths)), 1) if strengths else 0.0,
            "maxSignalStrengthPercent": max(strengths) if strengths else 0,
        })

    summary: Dict[str, Any] = {
        "imageWidth": int(width),
        "imageHeight": int(height),
        "frequencyRangeMHz": [float(FREQ_MIN), float(FREQ_MAX)],
        "targetBandwidthMHz": float(BANDWIDTH),
        "hotPixelRatioPercent": round((hot_pixels / roi_area) * 100.0, 3),
        "totalMergedDetections": int(sum(merged_counts.values())),
        "targets": per_target,
    }

    return output_img, mask_viz, summary


def _build_legend(fig: plt.Figure) -> None:
    """Add a small per-target colour legend to the figure."""
    from matplotlib.patches import Patch
    handles = [
        Patch(color=tuple(c / 255 for c in _TARGET_COLORS_BGR[i][::-1]),
              label=f"Target {i}: {TARGET_SIGNALS[i]:.2f} MHz")
        for i in range(len(TARGET_SIGNALS))
    ]
    fig.legend(handles=handles, loc="lower center", ncol=len(TARGET_SIGNALS),
               fontsize=8, framealpha=0.7)


def _make_figure(img: np.ndarray, output_img: np.ndarray, mask_viz: np.ndarray) -> plt.Figure:
    """Compose a 3-panel figure: original | detection mask | annotated result."""
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))

    axes[0].set_title("Original Spectrogram", fontsize=10)
    axes[0].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    axes[0].axis('off')

    axes[1].set_title("Hot-Pixel Detection Mask", fontsize=10)
    axes[1].imshow(cv2.cvtColor(mask_viz, cv2.COLOR_BGR2RGB), cmap='hot')
    axes[1].axis('off')

    axes[2].set_title("Detected Jamming Events", fontsize=10)
    axes[2].imshow(cv2.cvtColor(output_img, cv2.COLOR_BGR2RGB))
    axes[2].axis('off')

    _build_legend(fig)
    fig.tight_layout(rect=[0, 0.06, 1, 1])
    return fig


def run_detection(image_bytes: bytes) -> bytes:
    """
    Accept raw image bytes, run jamming detection, return a 3-panel
    matplotlib figure as PNG bytes.  Suitable for use in the REST API.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes — unsupported format or corrupt data.")

    output_img, mask_viz, _ = _process_image(img)
    fig = _make_figure(img, output_img, mask_viz)

    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def run_detection_summary(image_bytes: bytes) -> Dict[str, Any]:
    """Return structured summary of detections for assistant/tool consumption."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes — unsupported format or corrupt data.")

    _, _, summary = _process_image(img)
    return summary


def detect_specific_jamming(image_path: str):
    """CLI entry point — reads a file from disk and saves the 3-panel result."""
    img = cv2.imread(image_path)
    if img is None:
        print("Error: Could not load image.")
        return

    output_img, mask_viz, _ = _process_image(img)
    fig = _make_figure(img, output_img, mask_viz)

    out_path = 'jamming_output.png'
    fig.savefig(out_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Result saved to {out_path}")


if __name__ == "__main__":
    detect_specific_jamming('image.png')