from datetime import datetime

from pydantic import BaseModel


class DoctorOut(BaseModel):
    """Lijecnik kako ga vidi administrator."""

    user_id: int
    display_name: str
    email: str
    institution: str
    license_number: str
    approval_status: str
    created_at: datetime
    rejection_reason: str | None = None


class RejectDoctorIn(BaseModel):
    """Tijelo zahtjeva kad admin odbija lijecnika."""

    reason: str