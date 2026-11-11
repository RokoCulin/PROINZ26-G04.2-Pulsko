from fastapi import Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth_dependencies import get_session_user
from app.db import get_db
from app.models import AppUser, DoctorProfile


def require_patient_access(
    patient_id: int,
    user: AppUser = Depends(get_session_user),
    db: Session = Depends(get_db),
) -> AppUser:
    if user.role == "patient":
        if user.user_id == patient_id:
            return user
        raise HTTPException(status_code=403, detail="Pristup nije dopusten")

    if user.role == "doctor":
        doctor = db.get(DoctorProfile, user.user_id)
        if doctor is None or doctor.approval_status != "approved":
            raise HTTPException(status_code=403, detail="Lijecnicki racun nije odobren")

        link = db.execute(
            text(
                """
                SELECT 1
                FROM doctor_patient_link
                WHERE doctor_id = :doctor_id
                    AND patient_id = :patient_id
                    AND status = 'accepted'
                LIMIT 1
                """
            ),
            {"doctor_id": user.user_id, "patient_id": patient_id},
        ).first()
        if link is not None:
            return user

    raise HTTPException(status_code=403, detail="Pristup nije dopusten")
