from pydantic import BaseModel
from typing import List, Optional


class TriageResult(BaseModel):
    symptoms: List[str]
    duration: str
    severity_score: int
    triage_category: str  # RED / YELLOW / GREEN
    suspected_condition: str
    triage_reason: str
    needs_specialist: str
    red_flags: List[str]


class VoiceIntakeResponse(BaseModel):
    transcript: str
    triage: TriageResult
    abha_id: Optional[str] = None


class TextIntakeRequest(BaseModel):
    text: str
    language: str = "English"
    abha_id: Optional[str] = None


class WhatsAppRequest(BaseModel):
    to_phone: str
    patient_name: str
    queue_position: int
    wait_minutes: int
    triage_status: str
    doctor_name: str = "Dr. On-Call"


class WhatsAppResponse(BaseModel):
    status: str
    message_sid: Optional[str] = None
    error: Optional[str] = None


class AmbulanceVitals(BaseModel):
    spo2: int
    heart_rate: int
    bp_systolic: int
    bp_diastolic: int
    rr: int
    gcs: int


class AmbulanceASHACheck(BaseModel):
    completed: bool
    worker_name: str
    checklist_flags: List[str]


class AmbulanceAlert(BaseModel):
    case_id: str
    patient_name: str
    eta_minutes: int
    pickup_location: str
    reported_complaint: str
    ai_pre_triage: str
    vitals: AmbulanceVitals
    asha_pre_check: AmbulanceASHACheck
    paramedic_notes: str


class PatientRecord(BaseModel):
    name: str
    age: int
    gender: str
    blood_group: str
    aadhaar_linked: bool
    allergies: List[str]
    chronic_conditions: List[str]
    current_medications: List[str]
    last_visit: str
    last_visit_reason: Optional[str] = None
    immunizations: List[str]
    pmjay_eligible: bool
    pmjay_card_number: Optional[str] = None
    pmjay_coverage_remaining: int
    pmjay_coverage_total: int
    emergency_contact: dict
    asha_worker: Optional[str] = None
    asha_phone: Optional[str] = None


class ABHAResponse(BaseModel):
    source: str
    abha_id: str
    patient: PatientRecord
