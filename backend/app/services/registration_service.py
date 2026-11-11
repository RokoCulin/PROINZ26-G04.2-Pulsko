from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import AppUser, DoctorProfile, PatientProfile


class RegistrationConflict(Exception):
    pass


class InvalidRegistration(Exception):
    pass


class RegistrationService:

    def __init__(self, db: Session):
        self.db = db

    def register(
        self,
        identity: dict,
        role: str,
        institution: str | None = None,
        license_number: str | None = None,
    ) -> AppUser:
        if role not in ("patient", "doctor"):
            raise InvalidRegistration("Neispravna uloga")

        provider = (identity.get("provider") or "").strip()
        subject = (identity.get("subject") or "").strip()
        email = (identity.get("email") or "").strip().lower()
        display_name = (identity.get("display_name") or "").strip() or email

        if not provider or not subject or not email:
            raise InvalidRegistration("Nedostaju podatci o korisniku")

        if role == "doctor":
            institution = (institution or "").strip()
            license_number = (license_number or "").strip()
            if not institution or not license_number:
                raise InvalidRegistration("Nedostaju podatci o lijecniku")

        existing = self.db.scalar(
            select(AppUser).where(
                AppUser.oidc_provider == provider,
                AppUser.oidc_subject == subject,
            )
        )
        if existing is not None:
            raise RegistrationConflict("Korisnik vec postoji")

        user = AppUser(
            oidc_provider=provider,
            oidc_subject=subject,
            email=email,
            display_name=display_name,
            role=role,
            last_login_at=datetime.now(timezone.utc),
        )

        try:
            self.db.add(user)
            self.db.flush()

            if role == "patient":
                self.db.add(PatientProfile(user_id=user.user_id))
            else:
                self.db.add(
                    DoctorProfile(
                        user_id=user.user_id,
                        institution=institution,
                        license_number=license_number,
                        approval_status="pending",
                    )
                )

            self.db.commit()
            self.db.refresh(user)
        except IntegrityError as error:
            self.db.rollback()
            raise RegistrationConflict("Registracija nije uspjela") from error
        except Exception:
            self.db.rollback()
            raise

        return user
