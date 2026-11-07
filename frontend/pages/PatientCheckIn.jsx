import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/PatientCheckIn.css";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("pulsko-metrics")) || [];
  } catch {
    return [];
  }
};

export default function PatientCheckIn() {
  const [steps, setSteps] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [sleep, setSleep] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function save(event) {
    event.preventDefault();

    const row = {
      date: new Date().toISOString().slice(0, 10),
      steps: Number(steps),
      heartRate: Number(heartRate),
      sleep: Number(sleep),
      mood,
      note,
    };

    const all = [...load(), row];

    localStorage.setItem("pulsko-metrics", JSON.stringify(all));

    setSaved(true);
  }

  return (
    <main className="pcheck-shell">
      <header className="pcheck-header">
        <Link className="pcheck-brand" to="/patient">
          ✳ <span>Pulsko</span>
        </Link>

        <Link to="/patient">← Back to overview</Link>
      </header>

      <section className="pcheck-intro">
        <p className="pcheck-eyebrow">YOUR PATIENT SPACE</p>
        <h1>Daily check-in</h1>

        <p className="pcheck-muted">
          Add today's activity and wellbeing information. You can update these
          values every day.
        </p>
      </section>

      <form className="pcheck-panel" onSubmit={save}>
        <h2>Daily measurements</h2>

        <div className="pcheck-grid">
          <label>
            Steps
            <input
              type="number"
              min="0"
              value={steps}
              onChange={(event) => {
                setSteps(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. 6500"
              required
            />
          </label>

          <label>
            Heart rate (bpm)
            <input
              type="number"
              min="20"
              max="250"
              value={heartRate}
              onChange={(event) => {
                setHeartRate(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. 72"
              required
            />
          </label>

          <label>
            Sleep (hours)
            <input
              type="number"
              min="0"
              max="24"
              step="0.1"
              value={sleep}
              onChange={(event) => {
                setSleep(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. 7.5"
              required
            />
          </label>

          <label>
            How are you feeling?
            <select
              value={mood}
              onChange={(event) => {
                setMood(event.target.value);
                setSaved(false);
              }}
              required
            >
              <option value="">Choose mood</option>
              {["Great", "Good", "Okay", "Low", "Unwell"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Additional note
          <textarea
            rows="4"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setSaved(false);
            }}
            placeholder="Symptoms, observations or anything you want to remember..."
          />
        </label>

        <p className="pcheck-disclaimer">
          Daily measurements are self-reported and are not a diagnosis or a
          substitute for medical advice.
        </p>

        <button className="pcheck-btn" type="submit">
          Save daily check-in →
        </button>

        {saved && (
          <p className="pcheck-success">
            Check-in saved in this browser for the demo.
          </p>
        )}
      </form>
    </main>
  );
}
