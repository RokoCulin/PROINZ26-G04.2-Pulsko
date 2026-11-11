from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class Reminder(Base):
    __tablename__ = "reminder"

    reminder_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    kind: Mapped[str]  # 'dose' | 'appointment'
    dose_id: Mapped[int | None] = mapped_column(
        ForeignKey("dose_event.dose_id", ondelete = "CASCADE"), unique = True
    )
    appointment_id: Mapped[int | None] = mapped_column(
        ForeignKey("appointment.appointment_id", ondelete = "CASCADE"), unique = True
    )
    due_at: Mapped[datetime]
    in_app_created_at: Mapped[datetime | None]
    email_status: Mapped[str] = mapped_column(server_default = "pending")
    email_attempts: Mapped[int] = mapped_column(server_default = "0")
    email_sent_at: Mapped[datetime | None]

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "reminders")
    dose_event: Mapped["DoseEvent | None"] = relationship(back_populates = "reminder")
    appointment: Mapped["Appointment | None"] = relationship(back_populates = "reminder")
