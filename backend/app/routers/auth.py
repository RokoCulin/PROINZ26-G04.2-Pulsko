
from datetime import datetime, timezone
from typing import Literal

from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import AppUser, DoctorProfile
from app.services.auth_service import oauth, get_google_userinfo
from app.services.registration_service import (
    InvalidRegistration,
    RegistrationConflict,
    RegistrationService,
)


router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterIn(BaseModel):
    role: Literal["patient", "doctor"]
    institution: str | None = None
    license_number: str | None = None


@router.get("/login")
async def login(request: Request):
    request.session.clear()
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(
        request, str(redirect_uri)
    )


@router.get("/callback", name="auth_callback")
async def auth_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        userinfo = await get_google_userinfo(request)
    except (OAuthError, ValueError) as error:
        raise HTTPException(
            status_code=400,
            detail="Google prijava nije uspjela",
        ) from error

    if userinfo.get("email_verified") is not True:
        raise HTTPException(
            status_code=403,
            detail="Email adresa nije potvrdena",
        )

    subject = userinfo.get("sub")
    email = userinfo.get("email")

    if not subject or not email:
        raise HTTPException(
            status_code=400,
            detail="Nedostaju podaci o korisniku",
        )

    request.session.pop("user_id", None)
    request.session.pop("pending_oidc", None)

    user = db.scalar(
        select(AppUser).where(
            AppUser.oidc_provider == "google",
            AppUser.oidc_subject == subject,
        )
    )

    if user is not None:
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()

        request.session["user_id"] = user.user_id

        return {
            "authenticated": True,
            "registration_required": False,
        }

    request.session["pending_oidc"] = {
        "provider": "google",
        "subject": subject,
        "email": email,
        "display_name": userinfo.get("name", ""),
    }

    return {
        "authenticated": False,
        "registration_required": True,
    }


@router.post("/register", status_code=201)
def complete_registration(
    body: RegisterIn,
    request: Request,
    db: Session = Depends(get_db),
):
    identity = request.session.get("pending_oidc")

    if identity is None:
        raise HTTPException(
            status_code=401,
            detail="Prvo se prijavite putem Googlea",
        )

    try:
        user = RegistrationService(db).register(
            identity=identity,
            role=body.role,
            institution=body.institution,
            license_number=body.license_number,
        )
    except InvalidRegistration as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error
    except RegistrationConflict as error:
        raise HTTPException(
            status_code=409,
            detail=str(error),
        ) from error

    request.session.pop("pending_oidc", None)
    request.session["user_id"] = user.user_id

    return {
        "user_id": user.user_id,
        "role": user.role,
    }


@router.get("/me")
def get_me(
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = request.session.get("user_id")

    if type(user_id) is not int:
        return {
            "authenticated": False,
            "registration_required": bool(
                request.session.get("pending_oidc")
            ),
        }

    user = db.get(AppUser, user_id)

    if user is None:
        request.session.clear()
        return {
            "authenticated": False,
            "registration_required": False,
        }

    approval_status = None

    if user.role == "doctor":
        doctor = db.get(DoctorProfile, user.user_id)
        if doctor is not None:
            approval_status = doctor.approval_status

    return {
        "authenticated": True,
        "registration_required": False,
        "user": {
            "user_id": user.user_id,
            "display_name": user.display_name,
            "email": user.email,
            "role": user.role,
            "approval_status": approval_status,
        },
    }


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}
