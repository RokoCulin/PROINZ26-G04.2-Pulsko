"""Offline deploy checks. Dummy settings are process-local test inputs only.

No database connection, Google request, Vercel project or migration is created.
Run: python -m unittest discover -s tests/deploy -v
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]


def probe(entrypoint):
    code = '''
import importlib
from fastapi.testclient import TestClient
from starlette.requests import Request
from itsdangerous import TimestampSigner
import base64, json
module = importlib.import_module(ENTRYPOINT)
app = module.app
prefix = app.root_path
with TestClient(app, base_url="https://progi-pulsko.vercel.app") as client:
    health = client.get(prefix + "/health")
    assert health.status_code == 200 and health.json() == {"status": "ok"}
    me = client.get(prefix + "/auth/me")
    assert me.status_code == 200 and me.json()["authenticated"] is False
    denied = client.get(prefix + "/patient/checkins")
    assert denied.status_code == 401
    missing = client.get(prefix + "/not-an-api-route")
    assert missing.status_code == 404 and missing.headers["content-type"].startswith("application/json")
    # CSRF must still reject a mutation without the token.
    assert client.post(prefix + "/auth/logout").status_code == 403
    # A signed unit-test session exercises cookies/CSRF without bypassing auth
    # in the actual application or contacting Google.
    session = base64.b64encode(json.dumps({"csrf_token":"unit-test-csrf"}).encode())
    client.cookies.set("pulsko_session", TimestampSigner(SECRET).sign(session).decode())
    logout = client.post(prefix + "/auth/logout", headers={"X-CSRF-Token":"unit-test-csrf"})
    assert logout.status_code == 200
    cookie = logout.headers["set-cookie"].lower()
    assert "secure" in cookie and "httponly" in cookie and "samesite=lax" in cookie
    client.cookies.clear()
    cancelled = client.get(prefix + "/auth/callback?error=access_denied", follow_redirects=False)
    assert cancelled.status_code == 303
    assert cancelled.headers["location"].startswith("https://progi-pulsko.vercel.app/signin?")
    scope = {"type":"http", "http_version":"1.1", "method":"GET", "scheme":"https",
             "server":("progi-pulsko.vercel.app",443), "path":prefix + "/auth/callback",
             "root_path":prefix, "query_string":b"", "headers":[], "router":app.router}
    callback = str(Request(scope).url_for("auth_callback"))
    assert callback == "https://progi-pulsko.vercel.app" + prefix + "/auth/callback", callback
print(prefix or "local-unprefixed")
'''
    secret = 'unit-test-only-session-key-more-than-32-characters'
    env = dict(os.environ, DATABASE_URL='postgresql://unit_test:unused@127.0.0.1:1/unit_test',
               GOOGLE_CLIENT_ID='unit-test-not-a-production-client',
               GOOGLE_CLIENT_SECRET='unit-test-not-a-production-secret',
               SESSION_SECRET_KEY=secret, FRONTEND_URL='https://progi-pulsko.vercel.app',
               AUTH_COOKIE_SECURE='true', AUTH_COOKIE_SAMESITE='lax', ADMIN_EMAILS='',
               PYTHONDONTWRITEBYTECODE='1')
    env.pop('PYTHONPATH', None)
    result = subprocess.run([sys.executable, '-c', f'ENTRYPOINT={entrypoint!r}\nSECRET={secret!r}\n'+code],
                            cwd=ROOT / 'backend', env=env, capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise AssertionError(result.stdout + result.stderr)
    return result.stdout.strip()


class VercelConfigTests(unittest.TestCase):
    def test_services_cannot_have_an_ambiguous_global_framework(self):
        # Regression: JSON Schema accepted this combination, but Vercel's
        # deployment validator rejected it before the preview could build.
        config = json.loads((ROOT / 'vercel.json').read_text())
        self.assertIn('services', config)
        self.assertNotIn('framework', config,
                         'Framework must be defined on its owning service, not globally.')


class BackendRoutingTests(unittest.TestCase):
    def test_vercel_prefix_auth_csrf_and_api_404(self):
        self.assertEqual(probe('app.vercel'), '/api')

    def test_local_backend_keeps_existing_unprefixed_routes(self):
        self.assertEqual(probe('app.main'), 'local-unprefixed')


if __name__ == '__main__':
    unittest.main()
