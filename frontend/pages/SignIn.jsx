import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch, ApiError, getMe, homePathFor, loginUrl } from "../src/api";
import "../css/SignIn.css";

const ROLE_LABEL = { patient: "pacijent", doctor: "liječnik" };

// Poruke za ?error=... koje backend šalje nakon Google prijave.
function messageFromQuery(params) {
  const error = params.get("error");
  if (error === "role_mismatch") {
    const role = ROLE_LABEL[params.get("registered_as")];
    return role
      ? `Ovaj račun je registriran kao ${role}. Odaberite tu ulogu za prijavu.`
      : "Ovaj račun je registriran s drugom ulogom.";
  }
  if (error === "no_account") {
    return "Za ovaj Google račun ne postoji korisnički račun. Odaberite ulogu za registraciju.";
  }
  if (error === "oauth_cancelled") {
    return "Prijava je otkazana.";
  }
  if (error === "oauth_failed") {
    return "Prijava nije uspjela, pokušaj ponovno.";
  }
  return "";
}

function registrationError(error) {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return "Registracija nije uspjela: račun ili broj licence već postoji.";
    }
    if (error.status === 401) {
      return "Prijava je istekla. Odaberite ulogu i prijavite se ponovno.";
    }
    return error.message;
  }
  return "Backend nije dostupan.";
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
      .catch(() => setError("Backend nije dostupan."))
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
            <p className="eyebrow">REGISTRACIJA LIJEČNIKA</p>
            <h1>Podaci o liječniku</h1>
            <p className="muted">
              Administrator će provjeriti ustanovu i broj licence prije nego
              što odobri vaš račun.
            </p>

            <label className="auth-field">
              Ustanova
              <input
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                maxLength={200}
                placeholder="npr. KBC Zagreb"
                required
              />
            </label>

            <label className="auth-field">
              Broj licence
              <input
                value={licenseNumber}
                onChange={(event) => setLicenseNumber(event.target.value)}
                maxLength={100}
                placeholder="npr. HLK-12345"
                required
              />
            </label>

            <button
              className="primary-btn full"
              type="submit"
              disabled={submitting || !institution.trim() || !licenseNumber.trim()}
            >
              {submitting ? "Šaljem…" : "Pošalji zahtjev →"}
            </button>

            {error && <p className="auth-error" role="alert">{error}</p>}
          </form>
        ) : (
          <>
            <p className="eyebrow">DOBRO DOŠLI</p>
            <h1>Prijava u Pulsko</h1>
            <p className="muted">
              Odaberite ulogu, zatim se prijavite Google računom. Jedan račun
              ima jednu ulogu.
            </p>

            <div className="auth-divider">
              <span />
              VAŠA ULOGA
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
                <b>Pacijent</b>
                <small>Pratite svoje zdravlje i budite povezani.</small>
              </button>

              <button
                type="button"
                className={role === "doctor" ? "role-choice selected" : "role-choice"}
                aria-pressed={role === "doctor"}
                onClick={() => setRole("doctor")}
              >
                <span className="role-symbol">⚕</span>
                <b>Liječnik</b>
                <small>Upravljajte pacijentima i koordinirajte skrb.</small>
              </button>
            </div>

            <button
              type="button"
              className="primary-btn full"
              disabled={!role || checking}
              onClick={continueLogin}
            >
              <b className="google-mark">G</b> Prijava putem Googlea
            </button>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <p className="demo-hint">
              Prijava putem Google računa (OAuth 2.0 / OpenID Connect).
              Administrator može odabrati bilo koju ulogu; sustav ga prepozna
              i otvori administratorsku stranicu.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
