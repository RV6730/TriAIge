import httpx
import json
import os
import re
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from models.schemas import TextIntakeRequest

load_dotenv()
router = APIRouter()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

LANGUAGE_NAMES = {
    "hi-IN": "Hindi", "ta-IN": "Tamil", "te-IN": "Telugu",
    "bn-IN": "Bengali", "mr-IN": "Marathi", "kn-IN": "Kannada",
    "gu-IN": "Gujarati", "ml-IN": "Malayalam", "en-IN": "English",
}

CLAUDE_PROMPT_TEMPLATE = """You are a medical triage AI for an Indian government hospital emergency room.

A patient just described their symptoms in {language}. The transcript is:

"{transcript}"

Extract and return ONLY a valid JSON object with these exact fields:
{{
  "symptoms": ["list", "of", "identified", "symptoms"],
  "duration": "how long symptoms have persisted (e.g. '2 days', '3 hours')",
  "severity_score": <integer 1-10, where 10 is life-threatening>,
  "triage_category": "<one of: RED (immediate), YELLOW (urgent), GREEN (non-urgent)>",
  "suspected_condition": "<most likely condition in plain language>",
  "triage_reason": "<one sentence explaining the severity score>",
  "needs_specialist": "<cardiology/neurology/general/pediatrics/orthopedics/none>",
  "red_flags": ["any alarming symptoms that indicate emergency"]
}}

Rules:
- Chest pain + shortness of breath = always RED
- High fever in child under 5 = YELLOW minimum
- Unconsciousness or seizure history = RED
- Stroke symptoms (slurred speech, facial droop, arm weakness) = RED
- Be conservative — escalate rather than under-triage
- Return ONLY the JSON. No explanation, no markdown fences."""


async def transcribe_audio_sarvam(audio_bytes: bytes, language_code: str) -> str:
    """Sarvam AI Speech-to-Text — saarika:v2 model."""
    if not SARVAM_API_KEY:
        return "[MOCK] मुझे सीने में दर्द हो रहा है और सांस लेने में तकलीफ हो रही है, पिछले 2 घंटे से"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.sarvam.ai/speech-to-text",
            headers={"api-subscription-key": SARVAM_API_KEY},
            files={"file": ("audio.webm", audio_bytes, "audio/webm")},
            data={"language_code": language_code, "model": "saarika:v2", "with_timestamps": "false"},
            timeout=30.0,
        )
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Sarvam AI error: {response.text}")
        return response.json().get("transcript", "")


MOCK_TRIAGE_RESULT = {
    "symptoms": ["chest pain", "shortness of breath", "diaphoresis"],
    "duration": "2 hours",
    "severity_score": 9,
    "triage_category": "RED (immediate)",
    "suspected_condition": "Suspected Acute Myocardial Infarction (STEMI)",
    "triage_reason": "Chest pain with radiation, diaphoresis, and dyspnoea for 2 hours — classic STEMI presentation.",
    "needs_specialist": "cardiology",
    "red_flags": ["chest pain >20 min", "diaphoresis", "shortness of breath"],
}


async def extract_symptoms_with_claude(transcript: str, language: str) -> dict:
    """
    Calls Anthropic Claude API via raw httpx (no SDK — avoids jiter/Rust dependency).
    Falls back to a realistic mock when ANTHROPIC_API_KEY is not set or API call fails.
    """
    if not ANTHROPIC_API_KEY:
        return MOCK_TRIAGE_RESULT

    prompt = CLAUDE_PROMPT_TEMPLATE.format(language=language, transcript=transcript)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-3-5-sonnet-20241022",
                    "max_tokens": 1000,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=30.0,
            )

        if response.status_code != 200:
            print(f"[TriAIge] Claude API error {response.status_code}: {response.text[:200]}")
            return MOCK_TRIAGE_RESULT

        raw = response.json()["content"][0]["text"].strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = re.sub(r"^```(?:json)?\n?", "", raw)
            raw = re.sub(r"\n?```$", "", raw)

        # Try to extract JSON from anywhere in the response
        try:
            return json.loads(raw.strip())
        except json.JSONDecodeError:
            match = re.search(r"\{[\s\S]+\}", raw)
            if match:
                return json.loads(match.group())
            print(f"[TriAIge] Could not parse Claude JSON, using mock. Raw: {raw[:200]}")
            return MOCK_TRIAGE_RESULT

    except Exception as e:
        print(f"[TriAIge] Claude call failed: {e}, using mock triage result")
        return MOCK_TRIAGE_RESULT


@router.post("/voice-intake")
async def voice_intake(
    audio: UploadFile = File(...),
    language_code: str = Form("hi-IN"),
    abha_id: str = Form(None),
):
    audio_bytes = await audio.read()
    transcript = await transcribe_audio_sarvam(audio_bytes, language_code)
    language_name = LANGUAGE_NAMES.get(language_code, "Hindi")
    triage_result = await extract_symptoms_with_claude(transcript, language_name)
    return {"transcript": transcript, "triage": triage_result, "abha_id": abha_id, "language_code": language_code}


@router.post("/text-intake")
async def text_intake(request: TextIntakeRequest):
    triage_result = await extract_symptoms_with_claude(request.text, request.language)
    return {"transcript": request.text, "triage": triage_result, "abha_id": request.abha_id, "language_code": "text"}


@router.get("/mock-demo")
async def mock_demo_triage():
    return {
        "transcript": "सीने में बहुत तेज दर्द हो रहा है, बाएं हाथ में भी दर्द जा रहा है, पसीना आ रहा है",
        "triage": {
            "symptoms": ["chest pain", "left arm pain", "diaphoresis"],
            "duration": "45 minutes",
            "severity_score": 9,
            "triage_category": "RED (immediate)",
            "suspected_condition": "Acute STEMI — Suspected Left Anterior Descending artery occlusion",
            "triage_reason": "Classic STEMI presentation: chest pain radiating to left arm with diaphoresis lasting 45 minutes.",
            "needs_specialist": "cardiology",
            "red_flags": ["chest pain >20 min", "left arm radiation", "diaphoresis", "possible STEMI"],
        },
        "abha_id": "DEFAULT",
        "language_code": "hi-IN",
    }
