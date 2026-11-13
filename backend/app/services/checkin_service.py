from datetime import date, datetime
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import DailyCheckin
from app.schemas.checkin import CheckinIn

# "Danas" se racuna po hrvatskom vremenu, ne po vremenu servera (UTC na deployu).
APP_TIMEZONE = ZoneInfo("Europe/Zagreb")


class CheckinConflict(Exception):
    pass


def today() -> date:
    return datetime.now(APP_TIMEZONE).date()


class CheckinService:
    """F-005 / UC-004: jedan check-in po pacijentu po danu."""

    def __init__(self, db: Session):
        self.db = db

    def save_today(self, patient_id: int, data: CheckinIn) -> tuple[DailyCheckin, bool]:
        """Spremi današnji unos ili ga zamijeni novim vrijednostima.

        Vraća (check-in, created): created je True ako je unos novi.
        """
        checkin_date = today()
        checkin = self.db.scalar(
            select(DailyCheckin).where(
                DailyCheckin.patient_id == patient_id,
                DailyCheckin.checkin_date == checkin_date,
            )
        )
        created = checkin is None
        if created:
            checkin = DailyCheckin(patient_id=patient_id, checkin_date=checkin_date)
            self.db.add(checkin)

        for field, value in data.model_dump().items():
            setattr(checkin, field, value)

        try:
            self.db.commit()
        except IntegrityError as error:
            # Npr. dva istovremena prva unosa istog dana.
            self.db.rollback()
            raise CheckinConflict("Check-in za danas je upravo spremljen, pokušajte ponovno") from error

        self.db.refresh(checkin)
        return checkin, created

    def list_recent(self, patient_id: int, limit: int) -> list[DailyCheckin]:
        return list(
            self.db.scalars(
                select(DailyCheckin)
                .where(DailyCheckin.patient_id == patient_id)
                .order_by(DailyCheckin.checkin_date.desc())
                .limit(limit)
            )
        )
