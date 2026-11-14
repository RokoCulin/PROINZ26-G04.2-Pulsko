from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.exc import DBAPIError, IntegrityError
from sqlalchemy.orm import Session

from app.models import AppUser, DoctorPatientLink, DoctorProfile
from app.schemas.link import (
    DoctorLinkOut,
    LinkedDoctorOut,
    LinkedPatientOut,
    PatientLinkOut,
)

ACTIVE_STATUSES = ("pending", "accepted")


class DoctorNotFound(Exception):
    pass


class LinkAlreadyExists(Exception):
    pass


class LinkNotFound(Exception):
    pass


class LinkNotPending(Exception):
    pass


class LinkRejectedByDatabase(Exception):
    """Npr. liječnik je dosegao 2125 pacijenata (triger enforce_link_rules)."""


class LinkService:
    """F-003 / UC-3, UC-5.3: povezivanje pacijenta s liječnikom."""

    def __init__(self, db: Session):
        self.db = db

    # --- pacijent ---------------------------------------------------------

    def request(self, patient_id: int, doctor_email: str) -> PatientLinkOut:
        doctor = self.db.scalar(
            select(DoctorProfile)
            .join(AppUser, AppUser.user_id == DoctorProfile.user_id)
            .where(
                func.lower(AppUser.email) == doctor_email.strip().lower(),
                AppUser.role == "doctor",
                DoctorProfile.approval_status == "approved",
            )
        )
        # Neodobren ili nepostojeći liječnik: ista poruka (ne otkriva se tko je registriran).
        if doctor is None:
            raise DoctorNotFound()

        if self._active_link(patient_id, doctor.user_id) is not None:
            raise LinkAlreadyExists()

        link = DoctorPatientLink(patient_id=patient_id, doctor_id=doctor.user_id, status="pending")
        self.db.add(link)
        try:
            self.db.commit()
        except IntegrityError as error:
            # Istovremeni zahtjev za isti par (link_active_pair_uq).
            self.db.rollback()
            raise LinkAlreadyExists() from error
        self.db.refresh(link)
        return self._patient_view(link)

    def list_for_patient(self, patient_id: int) -> list[PatientLinkOut]:
        links = self.db.scalars(
            select(DoctorPatientLink)
            .where(DoctorPatientLink.patient_id == patient_id)
            .order_by(DoctorPatientLink.requested_at.desc(), DoctorPatientLink.link_id.desc())
        )
        return [self._patient_view(link) for link in links]

    # --- liječnik ---------------------------------------------------------

    def list_for_doctor(self, doctor_id: int, status: str) -> list[DoctorLinkOut]:
        order = (
            DoctorPatientLink.requested_at.asc()
            if status == "pending"
            else DoctorPatientLink.responded_at.desc()
        )
        links = self.db.scalars(
            select(DoctorPatientLink)
            .where(DoctorPatientLink.doctor_id == doctor_id, DoctorPatientLink.status == status)
            .order_by(order, DoctorPatientLink.link_id)
        )
        return [self._doctor_view(link) for link in links]

    def respond(self, doctor_id: int, link_id: int, accept: bool) -> DoctorLinkOut:
        link = self.db.get(DoctorPatientLink, link_id, with_for_update=True)
        # Tuđi zahtjev se ponaša kao nepostojeći (ne otkriva se da postoji).
        if link is None or link.doctor_id != doctor_id:
            self.db.rollback()
            raise LinkNotFound()
        if link.status != "pending":
            self.db.rollback()
            raise LinkNotPending()

        link.status = "accepted" if accept else "rejected"
        link.responded_at = datetime.now(timezone.utc)
        try:
            self.db.commit()
        except DBAPIError as error:
            self.db.rollback()
            raise LinkRejectedByDatabase(str(error.orig).splitlines()[0]) from error
        self.db.refresh(link)
        return self._doctor_view(link)

    # --- pomoćno ----------------------------------------------------------

    def _active_link(self, patient_id: int, doctor_id: int) -> DoctorPatientLink | None:
        return self.db.scalar(
            select(DoctorPatientLink).where(
                DoctorPatientLink.patient_id == patient_id,
                DoctorPatientLink.doctor_id == doctor_id,
                DoctorPatientLink.status.in_(ACTIVE_STATUSES),
            )
        )

    @staticmethod
    def _patient_view(link: DoctorPatientLink) -> PatientLinkOut:
        doctor = link.doctor_profile
        return PatientLinkOut(
            link_id=link.link_id,
            status=link.status,
            requested_at=link.requested_at,
            responded_at=link.responded_at,
            doctor=LinkedDoctorOut(
                user_id=doctor.user_id,
                display_name=doctor.user.display_name,
                email=doctor.user.email,
                institution=doctor.institution,
            ),
        )

    @staticmethod
    def _doctor_view(link: DoctorPatientLink) -> DoctorLinkOut:
        patient = link.patient_profile.user
        return DoctorLinkOut(
            link_id=link.link_id,
            status=link.status,
            requested_at=link.requested_at,
            responded_at=link.responded_at,
            patient=LinkedPatientOut(
                user_id=patient.user_id,
                display_name=patient.display_name,
                email=patient.email,
            ),
        )
