from datetime import date, datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class Notification(Base):
    __tablename__ = "notification"

    notification_id: Mapped[int] = mapped_column(primary_key = True)
    user_id: Mapped[int] = mapped_column(ForeignKey("app_user.user_id"))
    type_: Mapped[str] = mapped_column("type")
    title: Mapped[str]
    body: Mapped[str | None]
    entity_type: Mapped[str | None]
    entity_id: Mapped[int | None]
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    read_at: Mapped[datetime | None]

    user: Mapped["AppUser"] = relationship(back_populates="notifications")