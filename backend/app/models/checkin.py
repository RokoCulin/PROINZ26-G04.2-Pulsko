from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import Numeric, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

class DailyCheckin(Base):
    __tablename__ = "daily_checkin"

    checkin_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    checkin_date: Mapped[date]
    general_state: Mapped[int | None]
    sleep_hours: Mapped[Decimal | None] = mapped_column(Numeric(4,2))
    steps: Mapped[int | None]
    heart_rate_bpm: Mapped[int | None]
    activity_minutes: Mapped[int | None]
    activity_description: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default = func.now())

    patient_profile: Mapped["PatientProfile"] = relationship(
        back_populates = "daily_checkins"
    )
