import hmac

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
        raise HTTPException(status_code=401, detail="Not signed in")

    user = db.get(AppUser, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Unknown user")

    return user


def require_approved_doctor(
    user: AppUser = Depends(get_session_user),
    db: Session = Depends(get_db),
) -> AppUser:
    if user.role != "doctor":
        raise HTTPException(status_code=403, detail="Access is allowed only for doctors")

    doctor = db.get(DoctorProfile, user.user_id)
    if doctor is None or doctor.approval_status != "approved":
        raise HTTPException(status_code=403, detail="Doctor account is not approved")

    return user


def require_csrf(request: Request) -> None:
    """POST/PUT/DELETE: zaglavlje X-CSRF-Token mora odgovarati tokenu iz sesije."""
    expected = request.session.get("csrf_token")
    received = request.headers.get("x-csrf-token", "")
    if not isinstance(expected, str) or not hmac.compare_digest(expected, received):
        raise HTTPException(status_code=403, detail="Invalid security token")


def require_patient(user: AppUser = Depends(get_session_user)) -> AppUser:
    if user.role != "patient":
        raise HTTPException(status_code=403, detail="Access is allowed only for patients")
    return user
