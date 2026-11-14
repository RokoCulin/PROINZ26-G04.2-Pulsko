import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch } from "../src/api";
import { LogoutButton, useAuth } from "../src/auth";
import DoctorLinksSection from "../src/DoctorLinksSection";
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

// Nalazi su 2. ciklus: te dvije brojke su i dalje demo.
const demoStats = [
  ["Lab reports", 2, "submitted (demo)"],
  ["To verify", 1, "lab reports (demo)"],
];

export default function DoctorHome() {
  const { user } = useAuth();

  // F-003: zahtjevi na čekanju i povezani pacijenti s backenda.
  const [requests, setRequests] = useState(null);
  const [patients, setPatients] = useState(null);
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/doctor/requests"), apiFetch("/doctor/patients")])
      .then(([pending, accepted]) => {
        setRequests(pending);
        setPatients(accepted);
      })
      .catch((error) => setLinkError(error.message));
  }, []);

  function handleLinkChange(link) {
    setRequests((rows) => rows.filter((row) => row.link_id !== link.link_id));
    if (link.status === "accepted") setPatients((rows) => [link, ...rows]);
  }

  const stats = [
    ["Pending requests", requests?.length ?? "—", "awaiting review"],
    ["Connected patients", patients?.length ?? "—", "accepted"],
    ...demoStats,
  ];

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

        <div className="auth-user">
          <span className="dhome-chip">⚕ {user.display_name}</span>
          <LogoutButton />
        </div>
      </header>

      <section className="dhome-welcome">
        <div>
          <p className="dhome-eyebrow">YOUR DOCTOR SPACE</p>

          <h1>Welcome back, {user.display_name}.</h1>

          <p className="dhome-muted">
            Review patient connections, follow health trends and coordinate
            care.
          </p>

          <a className="dhome-btn" href="#zahtjevi">
            Review requests →
          </a>
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

      <div id="zahtjevi">
        <DoctorLinksSection
          requests={requests}
          patients={patients}
          error={linkError}
          onChange={handleLinkChange}
        />
      </div>

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
