import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/PatientHome.css";

const seedDoctors = [
  {
    id: "PUL-10021",
    name: "Dr. Ana Novak",
    specialty: "Internal medicine",
    place: "Pulsko Health Centre",
  },
  {
    id: "PUL-10034",
    name: "Dr. Marko Kovač",
    specialty: "Cardiology",
    place: "Pulsko Health Centre",
  },
  {
    id: "PUL-10058",
    name: "Dr. Lea Horvat",
    specialty: "Clinical pharmacy",
    place: "Pulsko Health Centre",
  },
];

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export default function PatientHome() {
  const [query, setQuery] = useState("");

  const [requests, setRequests] = useState(() =>
    read("pulsko-patient-requests", []),
  );

  const doctors = useMemo(
    () =>
      seedDoctors.filter((doctor) =>
        (doctor.name + " " + doctor.id + " " + doctor.specialty)
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  function requestDoctor(doctor) {
    if (requests.some((item) => item.id === doctor.id)) {
      return;
    }

    const next = [...requests, { ...doctor, status: "Pending" }];

    setRequests(next);

    localStorage.setItem("pulsko-patient-requests", JSON.stringify(next));
  }

  const metrics = read("pulsko-metrics", []);
  const latest = metrics.at(-1);

  const labs = read("pulsko-labs", []);

  return (
    <main className="phome-shell">
      <header className="phome-header">
        <Link className="phome-brand" to="/patient">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <nav className="phome-nav">
          <Link to="/patient">Overview</Link>
          <Link to="/patient/labs">Lab results</Link>
          <Link to="/patient/appointments">Appointments</Link>
          <Link to="/patient/messages">Messages</Link>
        </nav>

        <span className="phome-chip">S&nbsp; Sample Patient</span>
      </header>

      <section className="phome-welcome">
        <div>
          <p className="phome-eyebrow">YOUR PATIENT SPACE</p>

          <h1>Good to see you, Sam.</h1>

          <p className="phome-muted">
            Your health information, care team and daily routines in one place.
          </p>

          <Link className="phome-btn" to="/patient/check-in">
            Complete daily check-in →
          </Link>
        </div>

        <div className="phome-art" aria-label="Decorative health illustration">
          <div className="phome-circle phome-circle-one" />
          <div className="phome-circle phome-circle-two" />
          <div className="phome-preview">
            <div className="phome-preview-heading">
              <span className="phome-preview-icon">+</span>
              <div>
                <strong>Your health space</strong>
                <small>Connected care, in one place</small>
              </div>
            </div>
            <svg
              className="phome-pulse-graphic"
              viewBox="0 0 420 130"
              aria-hidden="true"
            >
              <path d="M0 70 H105 L135 70 L154 34 L181 104 L209 58 L229 70 H278 L302 70 L322 43 L344 93 L365 70 H420" />
            </svg>
            <div className="phome-preview-bottom">
              <span>YOUR CARE TEAM</span>
              <span className="phome-connected-dot" /> Connected
            </div>
          </div>
        </div>
      </section>

      <section className="phome-block">
        <div className="phome-heading">
          <div>
            <p className="phome-eyebrow">AT A GLANCE</p>
            <h2>Your health snapshot</h2>
          </div>

          <Link to="/patient/check-in">Add today's data →</Link>
        </div>

        <div className="phome-metrics">
          <article className="phome-metric">
            <small>Steps</small>
            <strong>{latest?.steps ?? "—"}</strong>
            <span>steps</span>
          </article>

          <article className="phome-metric">
            <small>Heart rate</small>
            <strong>
              {latest?.heartRate ? `${latest.heartRate} bpm` : "—"}
            </strong>
            <span>latest measurement</span>
          </article>

          <article className="phome-metric">
            <small>Sleep</small>
            <strong>{latest?.sleep ? `${latest.sleep} h` : "—"}</strong>
            <span>last night</span>
          </article>

          <article className="phome-metric">
            <small>Lab results</small>
            <strong>{labs.length}</strong>
            <span>uploaded reports</span>
          </article>
        </div>
      </section>

      <section className="phome-block">
        <div className="phome-heading">
          <div>
            <p className="phome-eyebrow">YOUR CARE TOOLS</p>
            <h2>What would you like to do?</h2>
          </div>
        </div>

        <div className="phome-tiles">
          <Link className="phome-tile" to="/patient/check-in">
            <span>＋</span>
            <h3>Daily check-in</h3>
            <p>Record steps, heart rate, sleep and how you feel.</p>
          </Link>

          <Link className="phome-tile" to="/patient/labs">
            <span>⌁</span>
            <h3>Lab results</h3>
            <p>Upload your lab reports and keep them in one place.</p>
          </Link>

          <Link className="phome-tile" to="/patient/therapy">
            <span>♡</span>
            <h3>Therapy</h3>
            <p>Review your medication schedule and reminders.</p>
          </Link>

          <Link className="phome-tile" to="/patient/health-agent">
            <span>✳</span>
            <h3>Health Agent</h3>
            <p>Understand confirmed information and prepare questions.</p>
          </Link>

          <Link className="phome-tile" to="/patient/appointments">
            <span>▦</span>
            <h3>Appointments</h3>
            <p>View upcoming and previous visits.</p>
          </Link>

          <Link className="phome-tile" to="/patient/messages">
            <span>✉</span>
            <h3>Messages</h3>
            <p>Contact doctors you are connected with.</p>
          </Link>
        </div>
      </section>

      <section className="phome-block phome-connect">
        <div>
          <p className="phome-eyebrow">BUILD YOUR CARE TEAM</p>
          <h2>Find your doctor</h2>
          <p className="phome-muted">
            Search by doctor name or unique profile ID and send a connection
            request.
          </p>
        </div>

        <label className="phome-search">
          Doctor name or profile ID
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Ana Novak or PUL-10021"
          />
        </label>

        <div className="phome-results">
          {doctors.map((doctor) => (
            <article className="phome-result" key={doctor.id}>
              <div className="phome-avatar">
                {doctor.name.split(" ").slice(-1)[0][0]}N
              </div>

              <div className="phome-grow">
                <b>{doctor.name}</b>
                <small>
                  {doctor.specialty} · {doctor.id}
                </small>
              </div>

              <button
                className="phome-secondary"
                onClick={() => requestDoctor(doctor)}
                disabled={requests.some((item) => item.id === doctor.id)}
              >
                {requests.some((item) => item.id === doctor.id)
                  ? "Request pending"
                  : "Request connection"}
              </button>
            </article>
          ))}

          {!doctors.length && (
            <p className="phome-muted">
              No doctors found. Check the name or profile ID.
            </p>
          )}
        </div>

        {!!requests.length && (
          <p className="phome-status">
            Pending requests: {requests.map((item) => item.name).join(", ")}
          </p>
        )}
      </section>

      <footer className="phome-footer">
        Pulsko · Care feels better when we're connected.
        <span>Academic demo — sample data only.</span>
      </footer>
    </main>
  );
}
