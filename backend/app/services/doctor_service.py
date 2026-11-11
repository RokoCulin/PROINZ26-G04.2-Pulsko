from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import AppUser, DoctorProfile
from app.schemas.doctor import DoctorOut


class DoctorNotFound(Exception):
    pass


class DoctorAlreadyReviewed(Exception):
    pass


class DoctorService:
    """F-019: administrator odobrava ili odbija registrirane lijecnike."""

    def __init__(self, db: Session):
        self.db = db

    def list_by_status(self, status: str) -> list[DoctorOut]:
        rows = self.db.execute(
            select(DoctorProfile, AppUser)
            .join(AppUser, AppUser.user_id == DoctorProfile.user_id)
            .where(DoctorProfile.approval_status == status)
            .order_by(DoctorProfile.created_at)
        ).all()
        return [self._to_out(doctor, user) for doctor, user in rows]

    def approve(self, doctor_id: int, admin_id: int) -> DoctorOut:
        doctor = self._get_pending(doctor_id)
        doctor.approval_status = "approved"
        self._mark_reviewed(doctor, admin_id)
        return self._to_out(doctor, doctor.user)

    def reject(self, doctor_id: int, admin_id: int, reason: str) -> DoctorOut:
        doctor = self._get_pending(doctor_id)
        doctor.approval_status = "rejected"
        doctor.rejection_reason = reason
        self._mark_reviewed(doctor, admin_id)
        return self._to_out(doctor, doctor.user)

    def _get_pending(self, doctor_id: int) -> DoctorProfile:
        doctor = self.db.get(DoctorProfile, doctor_id)
        if doctor is None:
            raise DoctorNotFound()
        if doctor.approval_status != "pending":
            raise DoctorAlreadyReviewed()
        return doctor

    def _mark_reviewed(self, doctor: DoctorProfile, admin_id: int) -> None:
        doctor.reviewed_by = admin_id
        doctor.reviewed_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(doctor)

    @staticmethod
    def _to_out(doctor: DoctorProfile, user: AppUser) -> DoctorOut:
        return DoctorOut(
            user_id=doctor.user_id,
            display_name=user.display_name,
            email=user.email,
            institution=doctor.institution,
            license_number=doctor.license_number,
            approval_status=doctor.approval_status,
            created_at=doctor.created_at,
            rejection_reason=doctor.rejection_reason,
        )