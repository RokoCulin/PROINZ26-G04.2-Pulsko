from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Pulsko API"
    database_url: str = ""
    frontend_url: str = "http://localhost:5173"
    # Popis e-mailova odvojenih zarezom koji pri PRVOJ Google prijavi postaju
    # administratori. Prazno = nema automatskog admina.
    admin_emails: str = ""

    @property
    def admin_email_set(self) -> frozenset[str]:
        return frozenset(
            email.strip().lower() for email in self.admin_emails.split(",") if email.strip()
        )


settings = Settings()