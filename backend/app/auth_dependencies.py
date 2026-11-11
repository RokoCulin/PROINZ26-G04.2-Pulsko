from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import AppUser, DoctorProfile


def get_session_user(
    request: Request,
    db: Session = Depends(get_db),
) -> AppUser:
    user_id = request.session.get("user_id")

    if type(user_id) is not int:
        raise HTTPException(status_code=401, detail="Niste prijavljeni")

    user = db.get(AppUser, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Nepoznat korisnik")

    return user


def require_approved_doctor(
    user: AppUser = Depends(get_session_user),
    db: Session = Depends(get_db),
) -> AppUser:
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail="Pristup je dopusten samo lijecnicima")

    doctor = db.get(DoctorProfile, user.user_id)
    if doctor is None or doctor.approval_status != "approved":
        raise HTTPException(status_code=403, detail="Lijecnicki racun nije odobren")

    return user
