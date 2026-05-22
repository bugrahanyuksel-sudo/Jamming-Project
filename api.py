import base64
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict
from uuid import uuid4

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import HTMLResponse, Response

from main import run_detection, run_detection_summary

app = FastAPI(
    title="Jamming Detection API",
    description="Upload a spectrogram image and receive an annotated PNG showing detected jamming events.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WEBSITE_PATH = Path(__file__).with_name("website.jsx")
_ASSISTANT_UPLOAD_CACHE: Dict[str, Dict[str, Any]] = {}
_LATEST_ASSISTANT_UPLOAD_ID: str | None = None
_MAX_ASSISTANT_UPLOADS = 20


def _load_website() -> str:
    raw_text = WEBSITE_PATH.read_text(encoding="utf-8")
    prefix = "const websiteHtml = String.raw`"
    suffix = "`;\n\nexport default websiteHtml;\n"

    if raw_text.startswith(prefix) and raw_text.endswith(suffix):
        return raw_text[len(prefix):-len(suffix)]

    return raw_text


@app.get("/health")
def health():
    """Liveness check — useful for n8n connectivity tests."""
    return {"status": "ok"}


@app.get("/trimble-assist-config")
def trimble_assist_config():
    """Frontend-safe Trimble Assist embed app URL."""
    app_url = os.getenv("TRIMBLE_ASSIST_APP_URL", "http://localhost:5173").strip()
    return {
        "enabled": bool(app_url),
        "appUrl": app_url,
    }


def _format_assistant_summary_text(summary: Dict[str, Any], file_name: str) -> str:
    targets = summary.get("targets", [])
    target_lines = []
    for t in targets:
        target_lines.append(
            f"- {t.get('targetFrequencyMHz', 0):.2f} MHz: "
            f"{t.get('mergedDetections', 0)} merged detections, "
            f"avg signal ~{t.get('avgSignalStrengthPercent', 0)}%"
        )

    lines = [
        f"Spectrogram analysis completed for {file_name}.",
        f"Image size: {summary.get('imageWidth', '?')}x{summary.get('imageHeight', '?')} px.",
        f"Frequency window: {summary.get('frequencyRangeMHz', ['?', '?'])[0]}-{summary.get('frequencyRangeMHz', ['?', '?'])[1]} MHz.",
        f"Hot-pixel ratio: {summary.get('hotPixelRatioPercent', 0)}%.",
        f"Total merged detections: {summary.get('totalMergedDetections', 0)}.",
        "Per target:",
        *target_lines,
    ]
    return "\n".join(lines)


@app.post("/assistant/upload-image")
async def assistant_upload_image(file: UploadFile = File(..., description="Spectrogram image for assistant context")):
    """Store uploaded image once so assistant tools can analyze it later."""
    global _LATEST_ASSISTANT_UPLOAD_ID

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    upload_id = str(uuid4())
    uploaded_at = datetime.now(timezone.utc).isoformat()
    _ASSISTANT_UPLOAD_CACHE[upload_id] = {
        "fileName": file.filename or "uploaded_spectrogram",
        "contentType": file.content_type or "application/octet-stream",
        "imageBytes": image_bytes,
        "uploadedAt": uploaded_at,
        "sizeBytes": len(image_bytes),
    }
    _LATEST_ASSISTANT_UPLOAD_ID = upload_id

    # Keep bounded memory usage.
    if len(_ASSISTANT_UPLOAD_CACHE) > _MAX_ASSISTANT_UPLOADS:
        oldest_id = next(iter(_ASSISTANT_UPLOAD_CACHE.keys()))
        _ASSISTANT_UPLOAD_CACHE.pop(oldest_id, None)

    return {
        "uploadId": upload_id,
        "fileName": _ASSISTANT_UPLOAD_CACHE[upload_id]["fileName"],
        "uploadedAt": uploaded_at,
        "sizeBytes": len(image_bytes),
    }


@app.post("/assistant/analyze-upload")
async def assistant_analyze_upload(request: Request):
    """Analyze latest (or provided) uploaded image and return text + structured summary."""
    global _LATEST_ASSISTANT_UPLOAD_ID

    payload: Dict[str, Any] = {}
    try:
        payload = await request.json()
        if not isinstance(payload, dict):
            payload = {}
    except Exception:
        payload = {}

    upload_id = payload.get("uploadId") or _LATEST_ASSISTANT_UPLOAD_ID
    if not upload_id:
        raise HTTPException(status_code=404, detail="No uploaded image found. Upload an image in Spectrogram Intake first.")

    item = _ASSISTANT_UPLOAD_CACHE.get(str(upload_id))
    if not item:
        raise HTTPException(status_code=404, detail="Upload ID not found. Please upload again.")

    try:
        summary = run_detection_summary(item["imageBytes"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    summary_text = _format_assistant_summary_text(summary, item["fileName"])
    return {
        "uploadId": upload_id,
        "fileName": item["fileName"],
        "uploadedAt": item["uploadedAt"],
        "summary": summary,
        "summaryText": summary_text,
    }


@app.get("/", response_class=HTMLResponse)
def landing_page():
    """Serve the browser UI for the jamming detection console."""
    return HTMLResponse(_load_website())


@app.get("/analyze", response_class=HTMLResponse)
def analyze_upload_page():
    """Serve the browser UI for manual spectrogram upload and review."""
    return HTMLResponse(_load_website())


@app.post(
    "/analyze",
    response_class=Response,
    responses={
        200: {"content": {"image/png": {}}, "description": "Side-by-side annotated PNG"},
        400: {"description": "Invalid or unreadable image"},
    },
)
async def analyze(file: UploadFile = File(..., description="Spectrogram image (PNG, JPG, etc.)")):
    """
    Upload a spectrogram image via multipart/form-data (field name: **file**).
    Returns a PNG with the original image on the left and the annotated
    jamming-detection result on the right.

    **n8n usage**
    - Node: HTTP Request
    - Method: POST
    - URL: http://<host>:8000/analyze
    - Body Content Type: Form-Data
    - Parameter name: `file`, value: binary image
    - Response Format: File
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        png_bytes = run_detection(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return Response(content=png_bytes, media_type="image/png")


@app.post(
    "/analyze-binary",
    response_class=Response,
    responses={
        200: {"content": {"image/png": {}}, "description": "Side-by-side annotated PNG"},
        400: {"description": "Invalid or unreadable image"},
    },
)
async def analyze_binary(request: Request):
    """
    Accept raw binary image data directly and return annotated PNG.
    Use this for n8n workflows where the file is already downloaded.

    **n8n HTTP Request configuration:**
    - Method: POST
    - URL: http://127.0.0.1:8000/analyze-binary
    - Body: Binary (select the file from Download file1)
    - Response: File

    **Example workflow:**
    1. Google Drive Trigger → file downloaded
    2. Download file1 → outputs binary
    3. HTTP Request (POST to /analyze-binary) → sends binary directly
    4. Response → annotated PNG
    """
    image_bytes = await request.body()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Request body is empty.")

    try:
        png_bytes = run_detection(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return Response(content=png_bytes, media_type="image/png")


@app.post(
    "/analyze-base64",
    response_class=Response,
    responses={
        200: {"content": {"image/png": {}}, "description": "Side-by-side annotated PNG"},
        400: {"description": "Invalid or unreadable image payload"},
    },
)
async def analyze_base64(request: Request):
    """
    Accept base64-encoded image data and return annotated PNG.

    Supported JSON shapes:
    - {"image_base64": "..."}
    - {"data": "..."}
    - {"file": "..."}

    Also supports data URL format:
    - data:image/png;base64,AAAA...
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Request must be JSON with a base64 image field.")

    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="JSON body must be an object.")

    b64_value = payload.get("image_base64") or payload.get("data") or payload.get("file")
    if not b64_value or not isinstance(b64_value, str):
        raise HTTPException(status_code=400, detail="Missing base64 string in image_base64, data, or file field.")

    # Accept both plain base64 and data URL form.
    if "," in b64_value and b64_value.lower().startswith("data:"):
        b64_value = b64_value.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(b64_value, validate=True)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image data.")

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Decoded image is empty.")

    try:
        png_bytes = run_detection(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return Response(content=png_bytes, media_type="image/png")
