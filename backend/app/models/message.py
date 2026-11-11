from datetime import date, datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class Message(Base):
    __tablename__ = "message"

    message_id: Mapped[int] = mapped_column(primary_key = True)
    link_id: Mapped[int] = mapped_column(ForeignKey("doctor_patient_link.link_id"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("app_user.user_id"))
    body: Mapped[str]
    sent_at: Mapped[datetime] = mapped_column(server_default = func.now())
    read_at: Mapped[datetime | None]

    sender: Mapped["AppUser"] = relationship(
        back_populates = "sent_messages"
    )
    link: Mapped["DoctorPatientLink"] = relationship(
        back_populates = "messages"
    )