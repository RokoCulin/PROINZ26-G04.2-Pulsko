import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorRequests.css";

const demoRequests = [
  {
    id: "PT-2043",
    name: "Mia Kovač",
    reason: "General check-up",
  },
  {
    id: "PT-2044",
    name: "Luka Babić",
    reason: "Therapy review",
  },
];

export default function DoctorRequests() {
  const [requests, setRequests] = useState(demoRequests);

  function decide(id) {
    setRequests(requests.filter((request) => request.id !== id));
  }

  return (
    <main className="dreq-shell">
      <header className="dreq-header">
        <Link className="dreq-brand" to="/doctor">
          ✳ <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dreq-intro">
        <p className="dreq-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Connection requests</h1>
        <p className="dreq-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dreq-panel">
        {requests.length ? (
          requests.map((request) => (
            <article className="dreq-item" key={request.id}>
              <div className="dreq-avatar">
                {request.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="dreq-grow">
                <b>{request.name}</b>
                <small>
                  {request.id} · {request.reason}
                </small>
                <small>Requested connection · Pending</small>
              </div>

              <button
                className="dreq-accept"
                onClick={() => decide(request.id)}
              >
                Accept
              </button>

              <button
                className="dreq-decline"
                onClick={() => decide(request.id)}
              >
                Decline
              </button>
            </article>
          ))
        ) : (
          <div className="dreq-empty">No pending connection requests.</div>
        )}

        <p className="dreq-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
