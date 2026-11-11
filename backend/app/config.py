from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Pulsko API"
    database_url: str = ""
    frontend_url: str = "http://localhost:5173"


settings = Settings()