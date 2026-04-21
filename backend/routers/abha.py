import json
import os
from fastapi import APIRouter

router = APIRouter()

_data_path = os.path.join(os.path.dirname(__file__), "..", "data", "mock_patients.json")
with open(_data_path) as f:
    MOCK_PATIENTS: dict = json.load(f)


@router.get("/fetch/{abha_id}")
async def fetch_abha_record(abha_id: str):
    """
    Production: POST to https://sandbox.abdm.gov.in/apis/
    Demo: returns realistic fixture patient data keyed by ABHA ID.
    Falls back to DEFAULT record for unknown IDs.
    """
    patient = MOCK_PATIENTS.get(abha_id, MOCK_PATIENTS["DEFAULT"])
    return {
        "source": "ABHA-MOCK",
        "abha_id": abha_id,
        "patient": patient,
    }


@router.get("/known-ids")
async def list_known_abha_ids():
    """Returns all ABHA IDs available in mock dataset (for demo use)."""
    return {"abha_ids": list(MOCK_PATIENTS.keys())}
