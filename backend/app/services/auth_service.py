from authlib.integrations.starlette_client import OAuth

from app.auth_settings import auth_settings


oauth = OAuth()

oauth.register(
    name="google",
    client_id=auth_settings.google_client_id,
    client_secret=auth_settings.google_client_secret,
    server_metadata_url=(
        "https://accounts.google.com/.well-known/"
        "openid-configuration"
    ),
    client_kwargs={
        "scope": "openid email profile",
    },
)


async def get_google_userinfo(request):
    # Google vraca tokene nakon uspjesne prijave.
    token = await oauth.google.authorize_access_token(request)

    # Authlib provjerava OIDC ID token i iz njega dobiva
    # podatke o korisniku.
    userinfo = token.get("userinfo")

    if not userinfo:
        raise ValueError("Google user information is missing.")

    if not userinfo.get("sub"):
        raise ValueError("Google user identifier is missing.")

    if not userinfo.get("email"):
        raise ValueError("Google email address is missing.")

    return userinfo
