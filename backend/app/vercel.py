"""Vercel-only entrypoint for the existing app; local app.main stays unchanged.

Services passes the original /api/... path. FastAPI/Starlette uses root_path
when matching routes, so /api/auth/me reaches the existing /auth/me handler.
This also gives generated callback/OpenAPI URLs the correct public prefix.
"""
from app.main import app

app.root_path = "/api"
