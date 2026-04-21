from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from routers import triage, abha, whatsapp, ambulance
from routers.ambulance import stream_ambulance_vitals

app = FastAPI(
    title="TriAIge API",
    description="AI-Powered Emergency Triage System for Indian Government Hospitals",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage.router, prefix="/api/triage", tags=["Triage"])
app.include_router(abha.router, prefix="/api/abha", tags=["ABHA"])
app.include_router(whatsapp.router, prefix="/api/notify", tags=["Notifications"])
app.include_router(ambulance.router, prefix="/api/ambulance", tags=["Ambulance"])


import os
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    # If frontend is built, serve index.html, else return API status
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
    index_path = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "service": "TriAIge API",
        "status": "operational",
        "health": "/health",
    }

# At the bottom, mount the dist folder and handle React Router fallbacks
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
if os.path.exists(dist_dir):
    # Mount assets folder exclusively
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all for SPA React Router
    @app.get("/{catchall:path}")
    async def serve_react_app(catchall: str):
        # Serve static file if it exists (e.g., favicon.svg)
        file_path = os.path.join(dist_dir, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to index.html
        return FileResponse(os.path.join(dist_dir, "index.html"))


# ── Socket.io for ambulance feed ──────────────────────────────────────────────
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, app)


@sio.event
async def connect(sid, environ):
    print(f"[TriAIge] Ambulance feed client connected: {sid}")
    # Start ambulance simulation in background for this session
    import asyncio
    asyncio.create_task(stream_ambulance_vitals(sio))


@sio.event
async def disconnect(sid):
    print(f"[TriAIge] Client disconnected: {sid}")


# Run with:
#   uvicorn main:socket_app --reload --port 8000
