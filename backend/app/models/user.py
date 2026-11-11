from datetime import date, datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class AppUser(Base):
    __tablename__ = "app_user"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    oidc_provider: Mapped[str]
    oidc_subject: Mapped[str]
    email: Mapped[str]
    display_name: Mapped[str]
    role: Mapped[str]  # 'patient' | 'doctor' | 'admin'
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    last_login_at: Mapped[datetime | None]

    doctor_profile: Mapped["DoctorProfile | None"] = relationship(
        back_populates="user", foreign_keys="DoctorProfile.user_id"
    )
    patient_profile: Mapped["PatientProfile | None"] = relationship(back_populates="user")
    sent_messages: Mapped[list["Message"]] = relationship(back_populates="sender")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user")
    reviewed_doctor_profiles: Mapped[list["DoctorProfile"]] = relationship(
        back_populates="reviewer", foreign_keys="DoctorProfile.reviewed_by"
    )
    audit_logs: Mapped[list["AuditLog"]] = relationship(back_populates="actor")


class PatientProfile(Base):
    __tablename__ = "patient_profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("app_user.user_id"), primary_key=True)
    role: Mapped[str] = mapped_column(server_default="patient")
    date_of_birth: Mapped[date | None]
    sex: Mapped[str | None]

    user: Mapped[AppUser] = relationship(back_populates="patient_profile")
    links: Mapped[list["DoctorPatientLink"]] = relationship(
        back_populates = "patient_profile"
    )
    daily_checkins: Mapped[list["DailyCheckin"]] = relationship(back_populates = "patient_profile")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="patient_profile")
    lab_reports: Mapped[list["LabReport"]] = relationship(back_populates="patient_profile")
    therapy_plans: Mapped[list["TherapyPlan"]] = relationship(back_populates="patient_profile")
    reminders: Mapped[list["Reminder"]] = relationship(back_populates="patient_profile")
    ai_chat_messages: Mapped[list["AiChatMessage"]] = relationship(back_populates="patient_profile")
    questions: Mapped[list["PatientQuestion"]] = relationship(back_populates="patient_profile")
    ai_summaries: Mapped[list["AiSummary"]] = relationship(back_populates="patient_profile")


class DoctorProfile(Base):
    __tablename__ = "doctor_profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("app_user.user_id"), primary_key=True)
    role: Mapped[str] = mapped_column(server_default="doctor")
    institution: Mapped[str]
    license_number: Mapped[str]
    approval_status: Mapped[str] = mapped_column(server_default="pending")
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("app_user.user_id"))
    reviewed_at: Mapped[datetime | None]
    rejection_reason: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())

    user: Mapped[AppUser] = relationship(back_populates="doctor_profile", foreign_keys=[user_id])
    reviewer: Mapped[AppUser | None] = relationship(
        back_populates="reviewed_doctor_profiles", foreign_keys=[reviewed_by]
    )
    links: Mapped[list["DoctorPatientLink"]] = relationship(
        back_populates = "doctor_profile"
    )
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="doctor_profile")
    therapy_plans: Mapped[list["TherapyPlan"]] = relationship(back_populates="doctor_profile")
    ai_summaries: Mapped[list["AiSummary"]] = relationship(back_populates="doctor_profile")
    reviewed_lab_reports: Mapped[list["LabReport"]] = relationship(back_populates="reviewer")
    reviewed_lab_values: Mapped[list["LabValue"]] = relationship(back_populates="reviewer")