import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch, ApiError, getMe, homePathFor, loginUrl } from "../src/api";
import "../css/SignIn.css";

const ROLE_LABEL = { patient: "a patient", doctor: "a doctor" };

// Poruke za ?error=... koje backend šalje nakon Google prijave.
function messageFromQuery(params) {
  const error = params.get("error");
  if (error === "role_mismatch") {
    const role = ROLE_LABEL[params.get("registered_as")];
    return role
      ? `This account is registered as ${role}. Choose that role to sign in.`
      : "This account is registered with a different role.";
  }
  if (error === "no_account") {
    return "There is no account for this Google account. Choose a role to register.";
  }
  if (error === "oauth_cancelled") {
    return "Sign-in was cancelled.";
  }
  if (error === "oauth_failed") {
    return "Sign-in failed, please try again.";
  }
  return "";
}

function registrationError(error) {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return "Registration failed: the account or licence number already exists.";
    }
    if (error.status === 401) {
      return "Your sign-in has expired. Choose a role and sign in again.";
    }
    return error.message;
  }
  return "The server is not available.";
}

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState("");
  const [error, setError] = useState(() => messageFromQuery(params));
  const [checking, setChecking] = useState(true);

  // Registracija liječnika (nakon Google prijave).
  const [doctorForm, setDoctorForm] = useState(null); // { csrfToken } kad je forma vidljiva
  const [institution, setInstitution] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const started = useRef(false);

  useEffect(() => {
    // StrictMode u razvoju pokreće efekt dvaput; registracija se smije poslati samo jednom.
    if (started.current) return;
    started.current = true;

    async function checkSession() {
      const me = await getMe();

      if (me.authenticated) {
        navigate(homePathFor(me.user), { replace: true });
        return;
      }

      if (me.registration_required && me.pending_role === "patient") {
        try {
          await apiFetch("/auth/register", {
            method: "POST",
            body: {},
            csrfToken: me.csrf_token,
          });
          navigate("/patient", { replace: true });
        } catch (err) {
          setError(registrationError(err));
        }
        return;
      }

      if (me.registration_required && me.pending_role === "doctor") {
        setDoctorForm({ csrfToken: me.csrf_token });
      }
    }

    checkSession()
      .catch(() => setError("The server is not available."))
      .finally(() => setChecking(false));
  }, [navigate]);

  function continueLogin() {
    if (!role) return;
    window.location.href = loginUrl(role);
  }

  async function submitDoctor(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: {
          institution: institution.trim(),
          license_number: licenseNumber.trim(),
        },
        csrfToken: doctorForm.csrfToken,
      });
      // /doctor prikazuje poruku "čeka odobrenje" dok admin ne odobri račun.
      navigate("/doctor", { replace: true });
    } catch (err) {
      setError(registrationError(err));
      if (err instanceof ApiError && err.status === 401) setDoctorForm(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pulsko-auth">
      <section className="auth-card">
        <a className="brand" href="/">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </a>

        {doctorForm ? (
          <form onSubmit={submitDoctor}>
            <p className="eyebrow">DOCTOR REGISTRATION</p>
            <h1>Doctor details</h1>
            <p className="muted">
              An administrator will check your institution and licence number
              before approving your account.
            </p>

            <label className="auth-field">
              Institution
              <input
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                maxLength={200}
                placeholder="e.g. KBC Zagreb"
                required
              />
            </label>

            <label className="auth-field">
              Licence number
              <input
                value={licenseNumber}
                onChange={(event) => setLicenseNumber(event.target.value)}
                maxLength={100}
                placeholder="e.g. HLK-12345"
                required
              />
            </label>

            <button
              className="primary-btn full"
              type="submit"
              disabled={submitting || !institution.trim() || !licenseNumber.trim()}
            >
              {submitting ? "Sending…" : "Send request →"}
            </button>

            {error && <p className="auth-error" role="alert">{error}</p>}
          </form>
        ) : (
          <>
            <p className="eyebrow">WELCOME</p>
            <h1>Sign in to Pulsko</h1>
            <p className="muted">
              Choose your role, then sign in with your Google account. One
              account has one role.
            </p>

            <div className="auth-divider">
              <span />
              YOUR ROLE
              <span />
            </div>

            <div className="role-grid">
              <button
                type="button"
                className={role === "patient" ? "role-choice selected" : "role-choice"}
                aria-pressed={role === "patient"}
                onClick={() => setRole("patient")}
              >
                <span className="role-symbol">♡</span>
                <b>Patient</b>
                <small>Track your health and stay connected.</small>
              </button>

              <button
                type="button"
                className={role === "doctor" ? "role-choice selected" : "role-choice"}
                aria-pressed={role === "doctor"}
                onClick={() => setRole("doctor")}
              >
                <span className="role-symbol">⚕</span>
                <b>Doctor</b>
                <small>Manage patients and coordinate care.</small>
              </button>
            </div>

            <button
              type="button"
              className="primary-btn full"
              disabled={!role || checking}
              onClick={continueLogin}
            >
              <b className="google-mark">G</b> Sign in with Google
            </button>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <p className="demo-hint">
              Sign-in uses your Google account (OAuth 2.0 / OpenID Connect).
              An administrator can choose any role; the system recognises them
              and opens the administrator page.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
