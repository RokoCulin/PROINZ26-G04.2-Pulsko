import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/DoctorPatients.css";

const patients = [
  {
    id: "PT-2041",
    name: "Sam Taylor",
    age: 34,
    condition: "Routine monitoring",
    last: "Today",
  },
  {
    id: "PT-2042",
    name: "Jamie Lee",
    age: 51,
    condition: "Cardiology follow-up",
    last: "Yesterday",
  },
];

export default function DoctorPatients() {
  return (
    <main className="dpat-shell">
      <header className="dpat-header">
        <Link className="dpat-brand" to="/doctor">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dpat-intro">
        <p className="dpat-eyebrow">DOCTOR WORKSPACE</p>
        <h1>My patients</h1>
        <p className="dpat-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dpat-panel">
        <p className="dpat-muted">Demo profiles available in this prototype.</p>

        {patients.map((patient) => (
          <article className="dpat-item" key={patient.id}>
            <div className="dpat-avatar">
              {patient.name
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div className="dpat-grow">
              <b>{patient.name}</b>
              <small>
                {patient.id} · Age {patient.age} · {patient.condition}
              </small>
            </div>

            <span className="dpat-pill">{patient.last}</span>
          </article>
        ))}

        <p className="dpat-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
