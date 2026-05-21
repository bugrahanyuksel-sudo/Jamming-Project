# Terrasat Jamming Detection

FastAPI-based spectrogram jamming detector with a browser UI for uploading images and reviewing annotated output.

The app analyzes spectrogram images, highlights suspected jamming events, and returns a 3-panel PNG showing the original image, a hot-pixel mask, and the annotated result.

## Features

- Upload PNG, JPG, WEBP, or BMP spectrogram images through the web UI.
- Run detection through the FastAPI `/analyze` endpoint.
- Review the annotated PNG output directly in the browser.
- Export the latest result and metadata from the UI.
- Check API health with a dedicated `/health` endpoint.

## Project Layout

- `api.py` - FastAPI application and HTTP endpoints.
- `main.py` - Image-processing and jamming-detection logic.
- `website.jsx` - Self-contained HTML/CSS/JS UI served by FastAPI.
- `requirements.txt` - Python dependencies.
- `agentic-ai-iframe-cleanup/` - Nested reference repo copied into this workspace.

## Requirements

- Python 3.10 or newer
- A virtual environment is recommended

## Setup

1. Create and activate a virtual environment.

	```powershell
	python -m venv .venv
	.\.venv\Scripts\Activate.ps1
	```

2. Install the dependencies.

	```powershell
	pip install -r requirements.txt
	```

3. Start the FastAPI app.

	```powershell
	python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
	```

4. Open the app in your browser.

	- http://127.0.0.1:8000/
	- http://127.0.0.1:8000/docs

## API Endpoints

- `GET /` - Serves the browser UI.
- `GET /health` - Returns the app health status.
- `POST /analyze` - Accepts multipart form upload with field name `file` and returns an annotated PNG.
- `POST /analyze-binary` - Accepts raw image bytes and returns an annotated PNG.
- `POST /analyze-base64` - Accepts a JSON payload with a base64 image string and returns an annotated PNG.

## Example Usage

### Multipart upload

Use the browser UI or send a form-data request with a `file` field to `/analyze`.

### Binary upload

Send raw image bytes to `/analyze-binary` when your upstream tool already has the image data in binary form.

### Base64 upload

Send JSON like this to `/analyze-base64`:

```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## Detection Notes

The detector is tuned for a fixed frequency window and target bands defined in `main.py`.
It converts the input image to HSV, extracts hot regions, merges nearby detections, and renders the final annotations into a PNG figure.

## Development Notes

- The UI is served directly from `website.jsx`; there is no separate frontend build pipeline in the root app.
- The repository includes a nested reference React project in `agentic-ai-iframe-cleanup/`.
- If you add new local-only files, keep them out of Git with `.gitignore`.

## License

No license file is currently included.
