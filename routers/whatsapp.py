import os
from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv
from models.schemas import WhatsAppRequest, WhatsAppResponse

load_dotenv()
router = APIRouter()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886"  # Twilio Sandbox number


@router.post("/whatsapp", response_model=WhatsAppResponse)
async def send_whatsapp_update(req: WhatsAppRequest, request: Request):
    """
    Sends a WhatsApp queue-update message via Twilio Sandbox.
    Requires:  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN in .env
    Family member must first send  "join <sandbox-keyword>"  to +14155238886.
    """
    # Detect the current domain dynamically (e.g., render.com or localhost)
    base_url = str(request.base_url).rstrip('/')
    tracking_link = f"{base_url}/tracker/AMB-108"

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        # Graceful mock for demo when no Twilio keys are set
        return WhatsAppResponse(
            status="mocked",
            message_sid="MOCK_SID_" + req.patient_name.replace(" ", "_"),
        )

    try:
        from twilio.rest import Client  # imported lazily so missing SDK doesn't crash startup

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        status_emoji = {"RED": "🔴", "YELLOW": "🟡", "GREEN": "🟢"}.get(
            req.triage_status, "⚪"
        )

        message_body = (
            f"🏥 *TriAIge — Government Hospital*\n\n"
            f"Update for patient *{req.patient_name}*:\n\n"
            f"📍 Queue Position: *#{req.queue_position}*\n"
            f"⏱ Estimated Wait: *{req.wait_minutes} minutes*\n"
            f"{status_emoji} Triage Status: *{req.triage_status}*\n"
            f"👨‍⚕️ Assigned: *{req.doctor_name}*\n\n"
            f"🚚 *Live Ambulance Tracking:* \n"
            f"{tracking_link}\n\n"
            f"_TriAIge — AI-Powered Triage System_"
        )

        message = client.messages.create(
            body=message_body,
            from_=TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{req.to_phone}",
        )
        return WhatsAppResponse(status="sent", message_sid=message.sid)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
