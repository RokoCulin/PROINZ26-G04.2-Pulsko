from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth_dependencies import require_csrf
from app.db import get_db
from app.dependencies import require_admin
from app.models import AppUser
from app.schemas.doctor import DoctorOut, RejectDoctorIn
from app.services.doctor_service import DoctorAlreadyReviewed, DoctorNotFound, DoctorService

router = APIRouter(prefix="/admin", tags=["admin"])


def _handle(action):
    try:
        return action()
    except DoctorNotFound:
        raise HTTPException(status_code=404, detail="Lijecnik ne postoji")
    except DoctorAlreadyReviewed:
        raise HTTPException(status_code=409, detail="Lijecnik je vec pregledan")


@router.get("/doctors", response_model=list[DoctorOut])
def list_doctors(
    status: Literal["pending", "approved", "rejected"] = "pending",
    db: Session = Depends(get_db),
    admin: AppUser = Depends(require_admin),
):
    return DoctorService(db).list_by_status(status)


@router.post(
    "/doctors/{doctor_id}/approve",
    response_model=DoctorOut,
    dependencies=[Depends(require_csrf)],
)
def approve_doctor(
    doctor_id: int, db: Session = Depends(get_db), admin: AppUser = Depends(require_admin)
):
    return _handle(lambda: DoctorService(db).approve(doctor_id, admin.user_id))


@router.post(
    "/doctors/{doctor_id}/reject",
    response_model=DoctorOut,
    dependencies=[Depends(require_csrf)],
)
def reject_doctor(
    doctor_id: int,
    body: RejectDoctorIn,
    db: Session = Depends(get_db),
    admin: AppUser = Depends(require_admin),
):
    return _handle(lambda: DoctorService(db).reject(doctor_id, admin.user_id, body.reason))