from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth_dependencies import require_approved_doctor, require_csrf
from app.db import get_db
from app.models import AppUser
from app.schemas.link import DoctorLinkOut
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
        raise HTTPException(status_code=404, detail="Zahtjev nije pronađen") from error
    except LinkNotPending as error:
        raise HTTPException(status_code=409, detail="Zahtjev je već obrađen") from error
    except LinkRejectedByDatabase as error:
        raise HTTPException(status_code=409, detail="Zahtjev nije moguće prihvatiti") from error


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
