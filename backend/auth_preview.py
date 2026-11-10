from starlette.middleware.sessions import SessionMiddleware

from app.auth_dependencies import get_session_user
from app.auth_settings import auth_settings
from app.dependencies import get_current_user
from app.main import app
from app.routers import auth


app.add_middleware(
    SessionMiddleware,
    secret_key=auth_settings.session_secret_key,
    session_cookie="pulsko_session",
    max_age=28800,
    same_site=auth_settings.auth_cookie_samesite,
    https_only=auth_settings.auth_cookie_secure,
)

app.include_router(auth.router)
app.dependency_overrides[get_current_user] = get_session_user
