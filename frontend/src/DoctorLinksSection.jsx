import { useState } from "react";
import { apiFetch } from "./api";
import { useAuth } from "./auth";

// F-003 / UC-5.3: liječnik obrađuje zahtjeve pacijenata i vidi povezane pacijente.
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "numeric", year: "numeric" });

export default function DoctorLinksSection({ requests, patients, error, onChange }) {
  const { csrfToken } = useAuth();
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function respond(link, action) {
    setBusyId(link.link_id);
    setActionError("");
    try {
      const updated = await apiFetch(`/doctor/requests/${link.link_id}/${action}`, {
        method: "POST",
        csrfToken,
      });
      onChange(updated);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="dhome-block dlink-grid">
      <div className="dlink-panel">
        <p className="dhome-eyebrow">PATIENT REQUESTS</p>
        <h2>Zahtjevi pacijenata</h2>

        {(error || actionError) && (
          <p className="dlink-error" role="alert">
            {actionError || error}
          </p>
        )}
        {requests === null && !error && <p className="dhome-muted">Učitavanje…</p>}
        {requests?.length === 0 && <p className="dhome-muted">Nema zahtjeva na čekanju.</p>}

        <ul className="dlink-list">
          {requests?.map((link) => (
            <li key={link.link_id}>
              <div className="dlink-grow">
                <b>{link.patient.display_name}</b>
                <small>
                  {link.patient.email} · poslano {formatDate(link.requested_at)}
                </small>
              </div>
              <button
                type="button"
                className="dlink-accept"
                disabled={busyId === link.link_id}
                onClick={() => respond(link, "accept")}
              >
                Prihvati
              </button>
              <button
                type="button"
                className="dlink-reject"
                disabled={busyId === link.link_id}
                onClick={() => respond(link, "reject")}
              >
                Odbij
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="dlink-panel">
        <p className="dhome-eyebrow">CONNECTED PATIENTS</p>
        <h2>Moji pacijenti</h2>

        {patients === null && !error && <p className="dhome-muted">Učitavanje…</p>}
        {patients?.length === 0 && <p className="dhome-muted">Još nemate povezanih pacijenata.</p>}

        <ul className="dlink-list">
          {patients?.map((link) => (
            <li key={link.link_id}>
              <div className="dlink-grow">
                <b>{link.patient.display_name}</b>
                <small>
                  {link.patient.email} · povezano {formatDate(link.responded_at)}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
