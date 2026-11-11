from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.auth_settings import auth_settings
from app.config import settings
from app.routers import admin, auth, health

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=auth_settings.session_secret_key,
    session_cookie="pulsko_session",
    max_age=28800,
    same_site=auth_settings.auth_cookie_samesite,
    https_only=auth_settings.auth_cookie_secure,
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(admin.router)
