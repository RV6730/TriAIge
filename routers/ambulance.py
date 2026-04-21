import asyncio
from fastapi import APIRouter

router = APIRouter()

INCOMING_AMBULANCE = {
    "case_id": "AMB-108-KA-2025-4421",
    "patient_name": "Suresh Naidu, 62M",
    "eta_minutes": 4,
    "pickup_location": "NH-48 near Kengeri Flyover",
    "reported_complaint": "Sudden chest pain, diaphoresis, left arm pain — onset ~35 min ago",
    "ai_pre_triage": "RED — Suspected STEMI",
    "vitals": {
        "spo2": 91,
        "heart_rate": 118,
        "bp_systolic": 152,
        "bp_diastolic": 98,
        "rr": 22,
        "gcs": 14,
    },
    "asha_pre_check": {
        "completed": True,
        "worker_name": "Kamala Devi",
        "checklist_flags": [
            "Chest pain >20min",
            "Radiation to left arm",
            "Diaphoresis",
        ],
    },
    "paramedic_notes": "Patient conscious. Aspirin 325mg given. IV line secured.",
    "route": [
        {"x": 10, "y": 80}, {"x": 25, "y": 75}, {"x": 40, "y": 60}, 
        {"x": 60, "y": 55}, {"x": 75, "y": 40}, {"x": 85, "y": 25}, 
        {"x": 90, "y": 10} # 90,10 is the Hospital
    ],
    "current_location_idx": 0
}


@router.get("/current")
async def get_current_ambulance():
    return INCOMING_AMBULANCE


async def stream_ambulance_vitals(sio):
    """
    Emits ambulance_incoming after delay.
    Then updates ETA and current location index.
    """
    await asyncio.sleep(8)
    await sio.emit("ambulance_incoming", INCOMING_AMBULANCE)

    for i in range(1, len(INCOMING_AMBULANCE["route"])):
        await asyncio.sleep(15)
        INCOMING_AMBULANCE["current_location_idx"] = i
        INCOMING_AMBULANCE["eta_minutes"] = max(0, 4 - i) # simulated eta reduction
        
        await sio.emit(
            "ambulance_update",
            {
                "case_id": INCOMING_AMBULANCE["case_id"], 
                "eta_minutes": INCOMING_AMBULANCE["eta_minutes"],
                "current_location_idx": i
            },
        )
