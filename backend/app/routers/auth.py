import logging
import secrets
from datetime import datetime, timezone
from typing import Literal
from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_dependencies import require_csrf
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
logger = logging.getLogger(__name__)


SelectableRole = Literal["patient", "doctor"]


class RegisterIn(BaseModel):
    # Uloga se NE salje u tijelu: uzima se iz sesije (odabrana na /auth/login).
    institution: str | None = Field(default=None, max_length=200)
    license_number: str | None = Field(default=None, max_length=100)


def _frontend_redirect(path: str) -> RedirectResponse:
    return RedirectResponse(url=f"{settings.frontend_url.rstrip('/')}{path}", status_code=303)


def _signin_redirect(**params: str) -> RedirectResponse:
    path = "/signin"
    if params:
        path += "?" + urlencode(params)
    return _frontend_redirect(path)


def _csrf_token(request: Request) -> str:
    token = request.session.get("csrf_token")
    if not isinstance(token, str):
        token = secrets.token_urlsafe(32)
        request.session["csrf_token"] = token
    return token


def _clear_pending_login(request: Request) -> None:
    """Brise privremene podatke prijave (odabrana uloga, Authlib state).

    Ne brise user_id: lazni callback ne smije odjaviti prijavljenog korisnika.
    """
    for key in list(request.session.keys()):
        if key in ("requested_role", "pending_role", "pending_oidc") or key.startswith("_state_"):
            request.session.pop(key, None)


def _create_bootstrap_admin(db: Session, subject: str, email: str, display_name: str) -> AppUser | None:
    """Stvara admina s ADMIN_EMAILS popisa (samo app_user, bez profila).

    Vraća None ako e-mail već koristi drugi račun (jedinstveni lower(email)).
    """
    user = AppUser(
        oidc_provider="google",
        oidc_subject=subject,
        email=email,
        display_name=display_name or email,
        role="admin",
        last_login_at=datetime.now(timezone.utc),
    )
    try:
        db.add(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        return None
    db.refresh(user)
    return user


@router.get("/login")
async def login(request: Request, role: SelectableRole | None = None):
    request.session.clear()
    # Odabrana uloga mora prezivjeti odlazak na Google, zato ide u sesiju.
    if role is not None:
        request.session["requested_role"] = role
    redirect_uri = auth_settings.google_redirect_uri or str(request.url_for("auth_callback"))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback", name="auth_callback")
async def auth_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    # Korisnik je na Googleu kliknuo "Odustani" (error=access_denied) ili je
    # Google vratio neku drugu gresku: vratiti ga na prijavu, ne JSON.
    google_error = request.query_params.get("error")
    if google_error:
        _clear_pending_login(request)
        code = "oauth_cancelled" if google_error == "access_denied" else "oauth_failed"
        return _signin_redirect(error=code)

    try:
        userinfo = await get_google_userinfo(request)
    except (OAuthError, ValueError):
        # Npr. mismatching_state (istekla sesija, ponovljen ili lazan callback).
        _clear_pending_login(request)
        return _signin_redirect(error="oauth_failed")

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

    is_listed_admin = email.strip().lower() in settings.admin_email_set
    if is_listed_admin and user is not None and user.role != "admin":
        # Namjerno bez automatskog promaknuća (profil i zdravstveni podaci).
        logger.warning(
            "ADMIN_EMAILS sadrzi postojeceg korisnika user_id=%s s ulogom %s; uloga se ne mijenja",
            user.user_id,
            user.role,
        )
    elif is_listed_admin and user is None:
        email_taken = db.scalar(
            select(AppUser.user_id).where(func.lower(AppUser.email) == email.strip().lower())
        )
        admin = None
        if email_taken is None:
            admin = _create_bootstrap_admin(
                db, subject, email.strip().lower(), (userinfo.get("name") or "").strip()
            )
        if admin is None:
            logger.warning(
                "ADMIN_EMAILS: e-mail vec koristi drugi racun (user_id=%s); admin nije stvoren",
                email_taken,
            )
        else:
            logger.info("ADMIN_EMAILS: stvoren administrator user_id=%s", admin.user_id)
            request.session.clear()
            request.session["user_id"] = admin.user_id
            _csrf_token(request)
            return _frontend_redirect("/admin")

    # Procitati prije clear(), inace se izgubi.
    requested_role = request.session.get("requested_role")
    if requested_role not in ("patient", "doctor"):
        requested_role = None

    request.session.clear()
    if user is not None:
        # Jedan Google racun = jedna uloga. Admin ne bira ulogu.
        if user.role != "admin" and requested_role != user.role:
            return _signin_redirect(error="role_mismatch", registered_as=user.role)

        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        request.session["user_id"] = user.user_id
    else:
        if requested_role is None:
            return _signin_redirect(error="no_account")

        save_pending_identity(
            request,
            {
                "provider": "google",
                "subject": subject,
                "email": email,
                "display_name": userinfo.get("name") or "",
            },
        )
        request.session["pending_role"] = requested_role

    _csrf_token(request)
    return _signin_redirect()


@router.post("/register", status_code=201)
def complete_registration(
    request: Request,
    body: RegisterIn | None = None,
    db: Session = Depends(get_db),
):
    require_csrf(request)
    identity = get_pending_identity(request)
    role = request.session.get("pending_role")
    if identity is None or role not in ("patient", "doctor"):
        raise HTTPException(status_code=401, detail="Prvo se prijavite putem Googlea")

    body = body or RegisterIn()
    try:
        user = RegistrationService(db).register(
            identity=identity,
            role=role,
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
            "pending_role": request.session.get("pending_role") if registration_required else None,
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
    require_csrf(request)
    request.session.clear()
    return {"message": "Logged out"}
