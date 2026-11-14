import { formatDate, useDoctorLinkList, useRespondToRequest } from "./doctorLinks";

// F-003 / UC-5.3: liječnik obrađuje zahtjeve pacijenata i vidi povezane pacijente.
// requests i patients su rezultati useDoctorLinkList (dijele ih i brojke na /doctor).
export default function DoctorLinksSection({ requests, patients }) {
  const { respond, busyId, error: actionError } = useRespondToRequest(() =>
    Promise.all([requests.reload(), patients.reload()]),
  );

  return (
    <section className="dhome-block dlink-grid">
      <div className="dlink-panel">
        <p className="dhome-eyebrow">PATIENT REQUESTS</p>
        <h2>Zahtjevi pacijenata</h2>

        {(requests.error || actionError) && (
          <p className="dlink-error" role="alert">
            {actionError || requests.error}
          </p>
        )}
        {requests.rows === null && !requests.error && <p className="dhome-muted">Učitavanje…</p>}
        {requests.rows?.length === 0 && <p className="dhome-muted">Nema zahtjeva.</p>}

        <ul className="dlink-list">
          {requests.rows?.map((link) => (
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
                disabled={busyId !== null}
                onClick={() => respond(link, "accept")}
              >
                Prihvati
              </button>
              <button
                type="button"
                className="dlink-reject"
                disabled={busyId !== null}
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

        {patients.error && (
          <p className="dlink-error" role="alert">
            {patients.error}
          </p>
        )}
        {patients.rows === null && !patients.error && <p className="dhome-muted">Učitavanje…</p>}
        {patients.rows?.length === 0 && <p className="dhome-muted">Još nemaš pacijenata.</p>}

        <ul className="dlink-list">
          {patients.rows?.map((link) => (
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
