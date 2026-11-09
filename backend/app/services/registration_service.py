from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import AppUser, DoctorProfile, PatientProfile


class RegistrationConflict(Exception):
    pass


class InvalidRegistration(Exception):
    pass


def register_user(
    db: Session,
    identity: dict,
    role: str,
    institution: str | None = None,
    license_number: str | None = None,
) -> AppUser:
    # Administrator se ne moze sam registrirati.
    if role not in ("patient", "doctor"):
        raise InvalidRegistration("Invalid role.")

    # Ovi podaci moraju doci iz provjerene Google sesije,
    # a ne iz podataka koje korisnik sam salje.
    provider = (identity.get("provider") or "").strip()
    subject = (identity.get("subject") or "").strip()
    email = (identity.get("email") or "").strip()
    display_name = (identity.get("display_name") or "").strip()

    if not provider or not subject or not email:
        raise InvalidRegistration("Missing verified identity.")

    if not display_name:
        display_name = email

    if role == "doctor":
        institution = (institution or "").strip()
        license_number = (license_number or "").strip()

        if not institution or not license_number:
            raise InvalidRegistration(
                "Institution and license number are required."
            )

    existing_user = db.scalar(
        select(AppUser).where(
            AppUser.oidc_provider == provider,
            AppUser.oidc_subject == subject,
        )
    )

    if existing_user is not None:
        raise RegistrationConflict("User is already registered.")

    user = AppUser(
        oidc_provider=provider,
        oidc_subject=subject,
        email=email,
        display_name=display_name,
        role=role,
        last_login_at=datetime.now(timezone.utc),
    )

    try:
        db.add(user)
        db.flush()

        if role == "patient":
            db.add(PatientProfile(user_id=user.user_id))
        else:
            db.add(
                DoctorProfile(
                    user_id=user.user_id,
                    institution=institution,
                    license_number=license_number,
                    approval_status="pending",
                )
            )

        db.commit()
        db.refresh(user)

    except IntegrityError as error:
        db.rollback()
        raise RegistrationConflict(
            "Registration conflicts with an existing account."
        ) from error

    except Exception:
        db.rollback()
        raise

    return user
