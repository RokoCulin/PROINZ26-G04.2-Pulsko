import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch } from "../src/api";
import { moodLabel } from "../src/checkin";
import { formatDate, initials, useDoctorLinkList } from "../src/doctorLinks";
import "../css/DoctorPatients.css";

const show = (value, unit = "") => (value === null || value === undefined ? "–" : `${value}${unit}`);

// F-005 / F-009 / UC-5.2: zadnji check-inovi povezanog pacijenta
// (GET /doctor/patients/{id}/checkins; backend vraća 403 za nepovezanog pacijenta).
function PatientCheckins({ patientId }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/doctor/patients/${patientId}/checkins`)
      .then(setRows)
      .catch((err) => setError(err.message));
  }, [patientId]);

  if (error) return <p className="dpat-error" role="alert">{error}</p>;
  if (rows === null) return <p className="dpat-muted">Loading…</p>;
  if (rows.length === 0) return <div className="dpat-empty">This patient has no check-ins yet.</div>;

  return (
    <div className="dpat-table-wrap">
      <table className="dpat-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Mood</th>
            <th>Sleep</th>
            <th>Steps</th>
            <th>Pulse</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.checkin_id}>
              <td>{formatDate(c.checkin_date)}</td>
              <td>{moodLabel(c.general_state) ?? "–"}</td>
              <td>{show(c.sleep_hours, " h")}</td>
              <td>{show(c.steps)}</td>
              <td>{show(c.heart_rate_bpm, " bpm")}</td>
              <td>
                {show(c.activity_minutes, " min")}
                {c.activity_description ? ` · ${c.activity_description}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// F-003: prihvaćeni pacijenti liječnika (GET /doctor/patients).
export default function DoctorPatients() {
  const patients = useDoctorLinkList("/doctor/patients");
  const [openId, setOpenId] = useState(null);

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
        <p className="dpat-muted">Patients you are connected with.</p>
      </section>

      <section className="dpat-panel">
        {patients.error && (
          <p className="dpat-error" role="alert">
            {patients.error}
          </p>
        )}

        {patients.rows === null && !patients.error && (
          <p className="dpat-muted">Loading…</p>
        )}

        {patients.rows?.length === 0 && (
          <div className="dpat-empty">You have no patients yet.</div>
        )}

        {patients.rows?.map((link) => {
          const patientId = link.patient.user_id;
          const open = openId === patientId;
          return (
            <div key={link.link_id}>
              <article className="dpat-item">
                <div className="dpat-avatar">{initials(link.patient.display_name)}</div>

                <div className="dpat-grow">
                  <b>{link.patient.display_name}</b>
                  <small>{link.patient.email}</small>
                </div>

                <span className="dpat-pill">Connected {formatDate(link.responded_at)}</span>

                <button
                  type="button"
                  className="dpat-toggle"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : patientId)}
                >
                  {open ? "Hide check-ins" : "Check-ins"}
                </button>
              </article>

              {open && <PatientCheckins patientId={patientId} />}
            </div>
          );
        })}
      </section>
    </main>
  );
}
