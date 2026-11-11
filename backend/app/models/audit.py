from datetime import datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class AuditLog(Base):
    """F-017: samo dodavanje; baza triggerom zabranjuje UPDATE i DELETE."""

    __tablename__ = "audit_log"

    audit_id: Mapped[int] = mapped_column(primary_key = True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("app_user.user_id"))
    action: Mapped[str]
    entity_type: Mapped[str]
    entity_id: Mapped[int | None]  # nije ForeignKey: može pokazivati na bilo koju tablicu
    old_value: Mapped[dict | None] = mapped_column(JSONB)
    new_value: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())

    actor: Mapped["AppUser | None"] = relationship(back_populates = "audit_logs")
