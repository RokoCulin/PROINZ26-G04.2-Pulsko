from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

# Rasponi su isti kao CHECK ograničenja u db/001_create_schema.sql (daily_checkin).


class CheckinIn(BaseModel):
    """Današnji check-in pacijenta (F-005, UC-004). Prazno polje = null."""

    model_config = ConfigDict(extra="forbid")

    general_state: int | None = Field(default=None, ge=1, le=5)
    sleep_hours: float | None = Field(default=None, ge=0, le=24)
    steps: int | None = Field(default=None, ge=0, le=100000)
    heart_rate_bpm: int | None = Field(default=None, ge=30, le=220)
    activity_minutes: int | None = Field(default=None, ge=0, le=1440)
    activity_description: str | None = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def not_empty(self):
        if self.activity_description is not None:
            self.activity_description = self.activity_description.strip() or None
        if all(value is None for value in self.model_dump().values()):
            raise ValueError("Unesite barem jednu vrijednost")
        return self


class CheckinOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    checkin_id: int
    checkin_date: date
    general_state: int | None
    sleep_hours: float | None
    steps: int | None
    heart_rate_bpm: int | None
    activity_minutes: int | None
    activity_description: str | None
    created_at: datetime
    updated_at: datetime
