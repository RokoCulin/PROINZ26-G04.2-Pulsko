import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignIn.css";

export default function SignIn() {
  const [role, setRole] = useState("");
  const [provider, setProvider] = useState("");

  const navigate = useNavigate();

  function continueLogin() {
    if (!role || !provider) return;

    localStorage.setItem("pulsko-demo-role", role);
    localStorage.setItem("pulsko-demo-provider", provider);

    navigate(role === "Patient" ? "/patient" : "/doctor");
  }

  return (
    <main className="pulsko-auth">
      <section className="auth-card">
        <a className="brand" href="/">
          ✳ <span>Pulsko</span>
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

        <p className="demo-hint">
          Academic prototype · Sign-in is simulated; no external identity
          provider is connected.
        </p>
      </section>
    </main>
  );
}
