import base64
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import HTMLResponse, Response

from main import run_detection

app = FastAPI(
    title="Jamming Detection API",
    description="Upload a spectrogram image and receive an annotated PNG showing detected jamming events.",
    version="1.0.0",
)

WEBSITE_PATH = Path(__file__).with_name("website.jsx")


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
