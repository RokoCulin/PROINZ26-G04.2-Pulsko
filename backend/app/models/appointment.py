from datetime import date, datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class Appointment(Base):
    __tablename__ = "appointment"

    appointment_id: Mapped[int] = mapped_column(primary_key = True)
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctor_profile.user_id"))
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    starts_at: Mapped[datetime]
    ends_at: Mapped[datetime]
    location: Mapped[str | None]
    note: Mapped[str | None]
    status: Mapped[str] = mapped_column(server_default = "scheduled")
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default = func.now())

    doctor_profile: Mapped["DoctorProfile"] = relationship(back_populates="appointments")
    patient_profile: Mapped["PatientProfile"] = relationship(back_populates="appointments")
    reminder: Mapped["Reminder | None"] = relationship(back_populates="appointment")