import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import {
  formatDate,
  initials,
  useDoctorLinkList,
  useRespondToRequest,
} from "../src/doctorLinks";
import "../css/DoctorRequests.css";

// F-003 / UC-5.3: zahtjevi pacijenata na čekanju (GET /doctor/requests).
export default function DoctorRequests() {
  const requests = useDoctorLinkList("/doctor/requests");
  const { respond, busyId, error: actionError } = useRespondToRequest(requests.reload);
  const error = actionError || requests.error;

  return (
    <main className="dreq-shell">
      <header className="dreq-header">
        <Link className="dreq-brand" to="/doctor">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dreq-intro">
        <p className="dreq-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Connection requests</h1>
        <p className="dreq-muted">
          Accept or reject patients’ connection requests.
        </p>
      </section>

      <section className="dreq-panel">
        {error && (
          <p className="dreq-error" role="alert">
            {error}
          </p>
        )}

        {requests.rows === null && !requests.error && (
          <p className="dreq-muted">Loading…</p>
        )}

        {requests.rows?.length === 0 && <div className="dreq-empty">No requests.</div>}

        {requests.rows?.map((link) => (
          <article className="dreq-item" key={link.link_id}>
            <div className="dreq-avatar">{initials(link.patient.display_name)}</div>

            <div className="dreq-grow">
              <b>{link.patient.display_name}</b>
              <small>{link.patient.email}</small>
              <small>Sent {formatDate(link.requested_at)} · Pending</small>
            </div>

            <button
              type="button"
              className="dreq-accept"
              disabled={busyId !== null}
              onClick={() => respond(link, "accept")}
            >
              Accept
            </button>

            <button
              type="button"
              className="dreq-decline"
              disabled={busyId !== null}
              onClick={() => respond(link, "reject")}
            >
              Reject
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
