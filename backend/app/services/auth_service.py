import base64
import hashlib
import json

from authlib.integrations.starlette_client import OAuth
from cryptography.fernet import Fernet, InvalidToken

from app.auth_settings import auth_settings


oauth = OAuth()

oauth.register(
    name="google",
    client_id=auth_settings.google_client_id,
    client_secret=auth_settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

_key = hashlib.sha256(
    auth_settings.session_secret_key.encode("utf-8") + b":pending-oidc"
).digest()
_cipher = Fernet(base64.urlsafe_b64encode(_key))


async def get_google_userinfo(request):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    if not userinfo:
        raise ValueError("Nedostaju podatci o korisniku")
    if not userinfo.get("sub"):
        raise ValueError("Nedostaje Google ID")
    if not userinfo.get("email"):
        raise ValueError("Nedostaje email")

    return userinfo


def save_pending_identity(request, identity: dict) -> None:
    data = json.dumps(identity).encode("utf-8")
    request.session["pending_oidc"] = _cipher.encrypt(data).decode("ascii")


def get_pending_identity(request) -> dict | None:
    token = request.session.get("pending_oidc")
    if not isinstance(token, str):
        return None

    try:
        data = _cipher.decrypt(token.encode("ascii"), ttl=15 * 60)
        identity = json.loads(data)
    except (InvalidToken, ValueError, TypeError, UnicodeError):
        request.session.pop("pending_oidc", None)
        return None

    if not isinstance(identity, dict) or not all(
        identity.get(key) for key in ("provider", "subject", "email")
    ):
        request.session.pop("pending_oidc", None)
        return None
    return identity
