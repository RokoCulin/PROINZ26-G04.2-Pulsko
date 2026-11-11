from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    count = db.execute(text("SELECT count(*) FROM biomarker")).scalar_one()
    return {"database": "ok", "biomarkers": count}