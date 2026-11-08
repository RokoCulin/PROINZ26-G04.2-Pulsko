from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import AppUser


def get_current_user(
    x_user_id: int | None = Header(default=None), db: Session = Depends(get_db)
) -> AppUser:
    # PRIVREMENO: korisnik se zadaje zaglavljem X-User-Id.
    # Kad Hrvoje napravi OAuth, ovdje se korisnik cita iz sesije.
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="Niste prijavljeni")
    user = db.get(AppUser, x_user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Nepoznat korisnik")
    return user


def require_admin(user: AppUser = Depends(get_current_user)) -> AppUser:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Samo administrator")
    return user