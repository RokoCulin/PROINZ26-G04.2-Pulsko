from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str | None = None
    session_secret_key: str = Field(min_length=32)
    auth_cookie_secure: bool = False
    auth_cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    @model_validator(mode="after")
    def check_cookie_settings(self):
        if self.auth_cookie_samesite == "none" and not self.auth_cookie_secure:
            raise ValueError("Neispravne sigurnosne postavke sesije")
        return self


auth_settings = AuthSettings()
