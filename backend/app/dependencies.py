from fastapi import Depends, HTTPException

from app.auth_dependencies import get_session_user
from app.models import AppUser


def require_admin(user: AppUser = Depends(get_session_user)) -> AppUser:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Samo administrator")
    return user