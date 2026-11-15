from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth_dependencies import require_approved_doctor, require_csrf
from app.db import get_db
from app.models import AppUser
from app.patient_access import require_patient_access
from app.schemas.checkin import CheckinOut
from app.schemas.link import DoctorLinkOut
from app.services.checkin_service import CheckinService
from app.services.link_service import (
    LinkNotFound,
    LinkNotPending,
    LinkRejectedByDatabase,
    LinkService,
)

router = APIRouter(prefix="/doctor", tags=["doctor"])


@router.get("/requests", response_model=list[DoctorLinkOut])
def list_requests(
    db: Session = Depends(get_db),
    doctor: AppUser = Depends(require_approved_doctor),
):
    """Zahtjevi pacijenata na čekanju, upućeni ovom liječniku (UC-5.3)."""
    return LinkService(db).list_for_doctor(doctor.user_id, "pending")


def _respond(db: Session, doctor: AppUser, link_id: int, accept: bool) -> DoctorLinkOut:
    try:
        return LinkService(db).respond(doctor.user_id, link_id, accept)
    except LinkNotFound as error:
        raise HTTPException(status_code=404, detail="Request not found") from error
    except LinkNotPending as error:
        raise HTTPException(status_code=409, detail="Request has already been handled") from error
    except LinkRejectedByDatabase as error:
        raise HTTPException(status_code=409, detail="Request cannot be accepted") from error


@router.post(
    "/requests/{link_id}/accept",
    response_model=DoctorLinkOut,
    dependencies=[Depends(require_csrf)],
)
def accept_request(
    link_id: int,
    db: Session = Depends(get_db),
    doctor: AppUser = Depends(require_approved_doctor),
):
    return _respond(db, doctor, link_id, accept=True)


@router.post(
    "/requests/{link_id}/reject",
    response_model=DoctorLinkOut,
    dependencies=[Depends(require_csrf)],
)
def reject_request(
    link_id: int,
    db: Session = Depends(get_db),
    doctor: AppUser = Depends(require_approved_doctor),
):
    return _respond(db, doctor, link_id, accept=False)


@router.get("/patients", response_model=list[DoctorLinkOut])
def list_patients(
    db: Session = Depends(get_db),
    doctor: AppUser = Depends(require_approved_doctor),
):
    """Prihvaćeni (povezani) pacijenti ovog liječnika."""
    return LinkService(db).list_for_doctor(doctor.user_id, "accepted")


@router.get(
    "/patients/{patient_id}/checkins",
    response_model=list[CheckinOut],
    dependencies=[Depends(require_approved_doctor), Depends(require_patient_access)],
)
def list_patient_checkins(
    patient_id: int,
    limit: int = Query(default=14, ge=1, le=90),
    db: Session = Depends(get_db),
):
    """Check-inovi povezanog pacijenta (F-005, F-009, UC-5.2).

    require_patient_access vraća 403 ako liječnik nije povezan s pacijentom.
    """
    return CheckinService(db).list_recent(patient_id, limit)
