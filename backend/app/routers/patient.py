from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.auth_dependencies import require_csrf, require_patient
from app.db import get_db
from app.models import AppUser
from app.schemas.checkin import CheckinIn, CheckinOut
from app.services.checkin_service import CheckinConflict, CheckinService

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
