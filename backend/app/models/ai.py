from datetime import datetime
from sqlalchemy import ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class AiChatMessage(Base):
    __tablename__ = "ai_chat_message"

    message_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    role: Mapped[str]  # 'user' | 'assistant'
    content: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "ai_chat_messages")


class PatientQuestion(Base):
    __tablename__ = "patient_question"

    question_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    question_text: Mapped[str]
    source: Mapped[str] = mapped_column(server_default = "ai_agent")
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "questions")


class AiSummary(Base):
    __tablename__ = "ai_summary"

    summary_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctor_profile.user_id"))
    model: Mapped[str | None]
    summary_text: Mapped[str]
    suggested_questions: Mapped[list[str]] = mapped_column(ARRAY(Text), server_default = "{}")
    patient_draft: Mapped[str | None]
    shared_text: Mapped[str | None]
    status: Mapped[str] = mapped_column(server_default = "draft")
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    shared_at: Mapped[datetime | None]

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "ai_summaries")
    doctor_profile: Mapped["DoctorProfile"] = relationship(back_populates = "ai_summaries")
