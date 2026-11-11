from datetime import date, datetime, time
from decimal import Decimal
from sqlalchemy import ForeignKey, Numeric, SmallInteger, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class TherapyPlan(Base):
    __tablename__ = "therapy_plan"

    plan_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctor_profile.user_id"))
    medication_name: Mapped[str]
    dose_amount: Mapped[Decimal] = mapped_column(Numeric(10, 3))
    dose_unit: Mapped[str]
    instructions: Mapped[str | None]
    start_date: Mapped[date]
    end_date: Mapped[date | None]
    status: Mapped[str] = mapped_column(server_default = "active")
    created_at: Mapped[datetime] = mapped_column(server_default = func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default = func.now())

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "therapy_plans")
    doctor_profile: Mapped["DoctorProfile"] = relationship(back_populates = "therapy_plans")
    schedules: Mapped[list["TherapySchedule"]] = relationship(back_populates = "plan")
    dose_events: Mapped[list["DoseEvent"]] = relationship(back_populates = "plan")


class TherapySchedule(Base):
    __tablename__ = "therapy_schedule"

    schedule_id: Mapped[int] = mapped_column(primary_key = True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("therapy_plan.plan_id", ondelete = "CASCADE"))
    time_of_day: Mapped[time]
    # ISO dani u tjednu: 1 = ponedjeljak ... 7 = nedjelja
    days_of_week: Mapped[list[int]] = mapped_column(
        ARRAY(SmallInteger), server_default = "{1,2,3,4,5,6,7}"
    )

    plan: Mapped["TherapyPlan"] = relationship(back_populates = "schedules")


class DoseEvent(Base):
    __tablename__ = "dose_event"

    dose_id: Mapped[int] = mapped_column(primary_key = True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("therapy_plan.plan_id", ondelete = "CASCADE"))
    scheduled_at: Mapped[datetime]
    status: Mapped[str] = mapped_column(server_default = "pending")
    recorded_at: Mapped[datetime | None]

    plan: Mapped["TherapyPlan"] = relationship(back_populates = "dose_events")
    reminder: Mapped["Reminder | None"] = relationship(back_populates = "dose_event")
