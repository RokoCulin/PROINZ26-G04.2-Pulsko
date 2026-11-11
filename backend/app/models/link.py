from datetime import date, datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class DoctorPatientLink(Base):

    __tablename__ = "doctor_patient_link"

    link_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctor_profile.user_id"))
    status: Mapped[str] = mapped_column(server_default = "pending")
    requested_at: Mapped[datetime] = mapped_column(server_default = func.now())
    responded_at: Mapped[datetime | None]

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates="links")
    doctor_profile: Mapped["DoctorProfile"] = relationship(back_populates="links")
    messages: Mapped[list["Message"]] = relationship(back_populates="link")
