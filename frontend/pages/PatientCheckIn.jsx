import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch, ApiError } from "../src/api";
import { useAuth } from "../src/auth";
import { MOODS, todayInZagreb } from "../src/checkin";
import "../css/PatientCheckIn.css";

const EMPTY = {
  steps: "",
  heartRate: "",
  sleep: "",
  mood: "",
  activityMinutes: "",
  activityDescription: "",
};

// Prazno polje -> null (backend sprema samo ono što je uneseno).
const toNumber = (value) => (value === "" ? null : Number(value));

function toForm(checkin) {
  const text = (value) => (value === null || value === undefined ? "" : String(value));
  return {
    steps: text(checkin.steps),
    heartRate: text(checkin.heart_rate_bpm),
    sleep: text(checkin.sleep_hours),
    mood: text(checkin.general_state),
    activityMinutes: text(checkin.activity_minutes),
    activityDescription: checkin.activity_description || "",
  };
}

export default function PatientCheckIn() {
  const { csrfToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ type: "idle" });
  const [hasToday, setHasToday] = useState(false);

  // Ako je današnji check-in već spremljen, forma se popuni njime.
  useEffect(() => {
    apiFetch("/patient/checkins?limit=1")
      .then(([latest]) => {
        if (latest && latest.checkin_date === todayInZagreb()) {
          setForm(toForm(latest));
          setHasToday(true);
        }
      })
      .catch(() => {});
  }, []);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (status.type !== "saving") setStatus({ type: "idle" });
    };
  }

  const isEmpty = Object.values(form).every((value) => value.trim() === "");

  async function save(event) {
    event.preventDefault();
    setStatus({ type: "saving" });

    try {
      await apiFetch("/patient/checkins", {
        method: "POST",
        csrfToken,
        body: {
          steps: toNumber(form.steps),
          heart_rate_bpm: toNumber(form.heartRate),
          sleep_hours: toNumber(form.sleep),
          general_state: toNumber(form.mood),
          activity_minutes: toNumber(form.activityMinutes),
          activity_description: form.activityDescription.trim() || null,
        },
      });
      // Samo nakon uspješnog odgovora: natrag na početnu, poruka ide kroz state.
      navigate("/patient", { state: { flash: "Check-in spremljen" } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setStatus({ type: "expired" });
      } else if (error instanceof ApiError) {
        setStatus({ type: "error", message: error.message });
      } else {
        setStatus({ type: "error", message: "Backend nije dostupan." });
      }
    }
  }

  return (
    <main className="pcheck-shell">
      <header className="pcheck-header">
        <Link className="pcheck-brand" to="/patient">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <Link to="/patient">← Back to overview</Link>
      </header>

      <section className="pcheck-intro">
        <p className="pcheck-eyebrow">YOUR PATIENT SPACE</p>
        <h1>Daily check-in</h1>

        <p className="pcheck-muted">
          Add today's activity and wellbeing information. Fill in only what you
          know; you can update today's check-in until midnight.
        </p>
      </section>

      <form className="pcheck-panel" onSubmit={save}>
        <h2>{hasToday ? "Today's check-in (saved)" : "Daily measurements"}</h2>

        <div className="pcheck-grid">
          <label>
            Steps
            <input
              type="number"
              min="0"
              max="100000"
              value={form.steps}
              onChange={update("steps")}
              placeholder="e.g. 6500"
            />
          </label>

          <label>
            Heart rate (bpm)
            <input
              type="number"
              min="30"
              max="220"
              value={form.heartRate}
              onChange={update("heartRate")}
              placeholder="e.g. 72"
            />
          </label>

          <label>
            Sleep (hours)
            <input
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={form.sleep}
              onChange={update("sleep")}
              placeholder="e.g. 7.5"
            />
          </label>

          <label>
            How are you feeling?
            <select value={form.mood} onChange={update("mood")}>
              <option value="">Choose mood</option>
              {MOODS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Activity (minutes)
            <input
              type="number"
              min="0"
              max="1440"
              value={form.activityMinutes}
              onChange={update("activityMinutes")}
              placeholder="e.g. 30"
            />
          </label>
        </div>

        <label>
          Activity description
          <textarea
            rows="3"
            maxLength={1000}
            value={form.activityDescription}
            onChange={update("activityDescription")}
            placeholder="e.g. 30 min walk, light cycling…"
          />
        </label>

        <p className="pcheck-disclaimer">
          Daily measurements are self-reported and are not a diagnosis or a
          substitute for medical advice.
        </p>

        <button
          className="pcheck-btn"
          type="submit"
          disabled={isEmpty || status.type === "saving"}
        >
          {status.type === "saving" ? "Saving…" : "Save daily check-in →"}
        </button>

        {status.type === "error" && (
          <p className="pcheck-error" role="alert">
            {status.message}
          </p>
        )}
        {status.type === "expired" && (
          <p className="pcheck-error" role="alert">
            Your session has expired. <Link to="/signin">Sign in again</Link>.
          </p>
        )}
      </form>
    </main>
  );
}
