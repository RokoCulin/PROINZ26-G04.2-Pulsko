import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/DoctorHome.css";

const links = [
  [
    "patients",
    "My patients",
    "Open profiles and review shared health information.",
    "♙",
  ],
  [
    "requests",
    "Connection requests",
    "Accept or decline patient connection requests.",
    "＋",
  ],
  ["appointments", "Appointments", "Review and manage upcoming visits.", "▦"],
  ["messages", "Messages", "Communicate with connected patients.", "✉"],
  [
    "therapy",
    "Therapy schedules",
    "Create medication schedules and reminders.",
    "♡",
  ],
  [
    "lab-results",
    "Lab verification",
    "Review and confirm submitted CBC values.",
    "✓",
  ],
];

const stats = [
  ["Pending requests", 2, "awaiting review"],
  ["Connected patients", 2, "demo profiles"],
  ["Lab reports", 2, "submitted"],
  ["To verify", 1, "lab reports"],
];

export default function DoctorHome() {
  return (
    <main className="dhome-shell">
      <header className="dhome-header">
        <Link className="dhome-brand" to="/doctor">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <nav className="dhome-nav">
          <Link to="/doctor/patients">My patients</Link>
          <Link to="/doctor/requests">Requests</Link>
          <Link to="/doctor/appointments">Appointments</Link>
          <Link to="/doctor/messages">Messages</Link>
        </nav>

        <span className="dhome-chip">⚕ Dr. Alex Morgan</span>
      </header>

      <section className="dhome-welcome">
        <div>
          <p className="dhome-eyebrow">YOUR DOCTOR SPACE</p>

          <h1>Welcome back, Dr. Morgan.</h1>

          <p className="dhome-muted">
            Review patient connections, follow health trends and coordinate
            care.
          </p>

          <Link className="dhome-btn" to="/doctor/requests">
            Review requests →
          </Link>
        </div>

        <div
          className="dhome-art"
          aria-label="Decorative doctor workspace illustration"
        >
          <div className="dhome-circle dhome-circle-one" />
          <div className="dhome-circle dhome-circle-two" />
          <div className="dhome-preview">
            <div className="dhome-preview-heading">
              <span className="dhome-preview-icon">⚕</span>
              <div>
                <strong>Doctor workspace</strong>
                <small>Patient-centred care, in one place</small>
              </div>
            </div>
            <svg
              className="dhome-pulse-graphic"
              viewBox="0 0 420 130"
              aria-hidden="true"
            >
              <path d="M0 70 H105 L135 70 L154 34 L181 104 L209 58 L229 70 H278 L302 70 L322 43 L344 93 L365 70 H420" />
            </svg>
            <div className="dhome-preview-bottom">
              <span>PROFILE ID · PUL-10021</span>
              <span className="dhome-connected-dot" /> Active
            </div>
          </div>
        </div>
      </section>

      <section className="dhome-stats">
        {stats.map(([label, value, text]) => (
          <article className="dhome-stat" key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
            <span>{text}</span>
          </article>
        ))}
      </section>

      <section className="dhome-block">
        <div className="dhome-heading">
          <div>
            <p className="dhome-eyebrow">DOCTOR TOOLS</p>
            <h2>Your workspace</h2>
          </div>

          <span className="dhome-muted">
            All sections are interactive demo views.
          </span>
        </div>

        <div className="dhome-tiles">
          {links.map(([path, title, description, icon]) => (
            <Link className="dhome-tile" to={`/doctor/${path}`} key={path}>
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="dhome-footer">
        Pulsko · Doctor workspace
        <span>Demo data only.</span>
      </footer>
    </main>
  );
}
