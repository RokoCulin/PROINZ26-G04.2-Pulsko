from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.auth_dependencies import require_csrf, require_patient
from app.db import get_db
from app.models import AppUser
from app.schemas.checkin import CheckinIn, CheckinOut
from app.schemas.link import LinkRequestIn, PatientLinkOut
from app.services.checkin_service import CheckinConflict, CheckinService
from app.services.link_service import DoctorNotFound, LinkAlreadyExists, LinkService

router = APIRouter(prefix="/patient", tags=["patient"])


@router.post(
    "/checkins",
    response_model=CheckinOut,
    status_code=201,
    dependencies=[Depends(require_csrf)],
    responses={200: {"description": "Današnji check-in je ažuriran"}},
)
def save_checkin(
    body: CheckinIn,
    response: Response,
    db: Session = Depends(get_db),
    patient: AppUser = Depends(require_patient),
):
    try:
        checkin, created = CheckinService(db).save_today(patient.user_id, body)
    except CheckinConflict as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    if not created:
        response.status_code = 200
    return checkin


@router.get("/checkins", response_model=list[CheckinOut])
def list_checkins(
    limit: int = Query(default=7, ge=1, le=90),
    db: Session = Depends(get_db),
    patient: AppUser = Depends(require_patient),
):
    return CheckinService(db).list_recent(patient.user_id, limit)


# --- F-003: povezivanje s liječnikom (UC-3) --------------------------------


@router.post(
    "/doctors",
    response_model=PatientLinkOut,
    status_code=201,
    dependencies=[Depends(require_csrf)],
)
def request_doctor(
    body: LinkRequestIn,
    db: Session = Depends(get_db),
    patient: AppUser = Depends(require_patient),
):
    try:
        return LinkService(db).request(patient.user_id, body.doctor_email)
    except DoctorNotFound as error:
        raise HTTPException(status_code=404, detail="Liječnik nije pronađen") from error
    except LinkAlreadyExists as error:
        raise HTTPException(
            status_code=409,
            detail="Zahtjev za ovog liječnika već čeka odgovor ili ste već povezani",
        ) from error


@router.get("/doctors", response_model=list[PatientLinkOut])
def list_my_doctors(
    db: Session = Depends(get_db),
    patient: AppUser = Depends(require_patient),
):
    return LinkService(db).list_for_patient(patient.user_id)
