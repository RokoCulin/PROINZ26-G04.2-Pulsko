import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/SignIn.css";

const API_URL = "http://localhost:8000"

export default function SignIn() {
  const [role, setRole] = useState("");
  const [provider, setProvider] = useState("");

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function checkSession() {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      const me = await res.json();

      if (me.authenticated) {
        navigate(me.user.role === "doctor" ? "/doctor" : "/patient");
        return;
      }

      if (me.registration_required) {
        const savedRole = sessionStorage.getItem("pulsko-role");
        if (!savedRole) return;

        const reg = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": me.csrf_token,
          },
          body: JSON.stringify({ role: savedRole }),
        });

        sessionStorage.removeItem("pulsko-role");

        if (reg.ok) {
          navigate(savedRole === "doctor" ? "/doctor" : "/patient");
        } else {
          setError("Registracija nije uspjela.");
        }
      }
    }

    checkSession().catch(() => setError("Backend nije dostupan."));
  }, [navigate]);

  function continueLogin() {
    if (!role || !provider) return;
    sessionStorage.setItem("pulsko-role", role.toLowerCase());
    window.location.href = `${API_URL}/auth/login`;
  }

  return (
    <main className="pulsko-auth">
      <section className="auth-card">
        <a className="brand" href="/">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </a>

        <p className="eyebrow">WELCOME BACK</p>

        <h1>Sign in to Pulsko</h1>

        <p className="muted">Choose a sign-in method and your workspace.</p>

        <div className="provider-list">
          <button
            className={
              provider === "oidc"
                ? "provider-choice selected"
                : "provider-choice"
            }
            onClick={() => setProvider("oidc")}
          >
            <b>◎</b>
            Continue with OpenID Connect
            <span>{provider === "oidc" ? "✓" : "○"}</span>
          </button>

          <button
            className={
              provider === "oauth"
                ? "provider-choice selected"
                : "provider-choice"
            }
            onClick={() => setProvider("oauth")}
          >
            <b>G</b>
            Continue with OAuth 2.0
            <span>{provider === "oauth" ? "✓" : "○"}</span>
          </button>
        </div>

        <div className="auth-divider">
          <span />
          YOUR ROLE
          <span />
        </div>

        <div className="role-grid">
          <button
            className={
              role === "Patient" ? "role-choice selected" : "role-choice"
            }
            onClick={() => setRole("Patient")}
          >
            <span className="role-symbol">♡</span>
            <b>Patient</b>
            <small>Track your health and stay connected.</small>
          </button>

          <button
            className={
              role === "Doctor" ? "role-choice selected" : "role-choice"
            }
            onClick={() => setRole("Doctor")}
          >
            <span className="role-symbol">⚕</span>
            <b>Doctor</b>
            <small>Manage patients and coordinate care.</small>
          </button>
        </div>

        <button
          className="primary-btn full"
          disabled={!role || !provider}
          onClick={continueLogin}
        >
          Continue to {role || "your workspace"} →
        </button>

        {error && <p className="muted">{error}</p>}
        <p className="demo-hint">
          Academic prototype · Sign-in is simulated; no external identity
          provider is connected.
        </p>
      </section>
    </main>
  );
}
