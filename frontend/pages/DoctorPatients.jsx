import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { formatDate, initials, useDoctorLinkList } from "../src/doctorLinks";
import "../css/DoctorPatients.css";

// F-003: prihvaćeni pacijenti liječnika (GET /doctor/patients).
export default function DoctorPatients() {
  const patients = useDoctorLinkList("/doctor/patients");

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
        <p className="dpat-muted">Pacijenti s kojima si povezan.</p>
      </section>

      <section className="dpat-panel">
        {patients.error && (
          <p className="dpat-error" role="alert">
            {patients.error}
          </p>
        )}

        {patients.rows === null && !patients.error && (
          <p className="dpat-muted">Učitavanje…</p>
        )}

        {patients.rows?.length === 0 && (
          <div className="dpat-empty">Još nemaš pacijenata.</div>
        )}

        {patients.rows?.map((link) => (
          <article className="dpat-item" key={link.link_id}>
            <div className="dpat-avatar">{initials(link.patient.display_name)}</div>

            <div className="dpat-grow">
              <b>{link.patient.display_name}</b>
              <small>{link.patient.email}</small>
            </div>

            <span className="dpat-pill">Povezano {formatDate(link.responded_at)}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
