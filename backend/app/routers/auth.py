import hmac
import secrets
from datetime import datetime, timezone
from typing import Literal

from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth_settings import auth_settings
from app.config import settings
from app.db import get_db
from app.models import AppUser, DoctorProfile
from app.services.auth_service import (
    get_google_userinfo,
    get_pending_identity,
    oauth,
    save_pending_identity,
)
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


def _csrf_token(request: Request) -> str:
    token = request.session.get("csrf_token")
    if not isinstance(token, str):
        token = secrets.token_urlsafe(32)
        request.session["csrf_token"] = token
    return token


def _require_csrf(request: Request) -> None:
    expected = request.session.get("csrf_token")
    received = request.headers.get("x-csrf-token", "")
    if not isinstance(expected, str) or not hmac.compare_digest(expected, received):
        raise HTTPException(status_code=403, detail="Neispravan sigurnosni token")


@router.get("/login")
async def login(request: Request):
    request.session.clear()
    redirect_uri = auth_settings.google_redirect_uri or str(request.url_for("auth_callback"))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback", name="auth_callback")
async def auth_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        userinfo = await get_google_userinfo(request)
    except (OAuthError, ValueError) as error:
        raise HTTPException(status_code=400, detail="Google prijava nije uspjela") from error

    if userinfo.get("email_verified") is not True:
        raise HTTPException(status_code=403, detail="Email adresa nije potvrdena")

    subject = userinfo.get("sub")
    email = userinfo.get("email")
    if not subject or not email:
        raise HTTPException(status_code=400, detail="Nedostaju podatci o korisniku")

    user = db.scalar(
        select(AppUser).where(
            AppUser.oidc_provider == "google",
            AppUser.oidc_subject == subject,
        )
    )

    request.session.clear()
    if user is not None:
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        request.session["user_id"] = user.user_id
    else:
        save_pending_identity(
            request,
            {
                "provider": "google",
                "subject": subject,
                "email": email,
                "display_name": userinfo.get("name") or "",
            },
        )

    _csrf_token(request)
    return RedirectResponse(url=f"{settings.frontend_url.rstrip('/')}/signin", status_code=303)


@router.post("/register", status_code=201)
def complete_registration(
    body: RegisterIn,
    request: Request,
    db: Session = Depends(get_db),
):
    _require_csrf(request)
    identity = get_pending_identity(request)
    if identity is None:
        raise HTTPException(status_code=401, detail="Prvo se prijavite putem Googlea")

    try:
        user = RegistrationService(db).register(
            identity=identity,
            role=body.role,
            institution=body.institution,
            license_number=body.license_number,
        )
    except InvalidRegistration as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except RegistrationConflict as error:
        raise HTTPException(status_code=409, detail=str(error)) from error

    request.session.clear()
    request.session["user_id"] = user.user_id
    _csrf_token(request)
    return {"user_id": user.user_id, "role": user.role}


@router.get("/me")
def get_me(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store"
    user_id = request.session.get("user_id")
    if type(user_id) is not int:
        registration_required = get_pending_identity(request) is not None
        return {
            "authenticated": False,
            "registration_required": registration_required,
            "csrf_token": _csrf_token(request) if registration_required else None,
        }

    user = db.get(AppUser, user_id)
    if user is None:
        request.session.clear()
        return {"authenticated": False, "registration_required": False}

    approval_status = None
    if user.role == "doctor":
        doctor = db.get(DoctorProfile, user.user_id)
        approval_status = doctor.approval_status if doctor is not None else None

    return {
        "authenticated": True,
        "registration_required": False,
        "csrf_token": _csrf_token(request),
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
    _require_csrf(request)
    request.session.clear()
    return {"message": "Logged out"}
