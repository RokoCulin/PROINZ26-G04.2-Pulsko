from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class LinkRequestIn(BaseModel):
    """Pacijent šalje zahtjev za povezivanje upisom e-maila liječnika (UC-3.2)."""

    model_config = ConfigDict(extra="forbid")

    doctor_email: str = Field(min_length=3, max_length=320)

    @field_validator("doctor_email")
    @classmethod
    def normalize(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value:
            raise ValueError("Neispravna e-mail adresa")
        return value


class LinkedDoctorOut(BaseModel):
    user_id: int
    display_name: str
    email: str
    institution: str


class LinkedPatientOut(BaseModel):
    user_id: int
    display_name: str
    email: str


class PatientLinkOut(BaseModel):
    """Veza kako je vidi pacijent."""

    link_id: int
    status: str
    requested_at: datetime
    responded_at: datetime | None
    doctor: LinkedDoctorOut


class DoctorLinkOut(BaseModel):
    """Zahtjev ili veza kako je vidi liječnik."""

    link_id: int
    status: str
    requested_at: datetime
    responded_at: datetime | None
    patient: LinkedPatientOut
