import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorLabVerification.css";

const demoLabs = [
  {
    id: 1,
    date: "2026-11-03",
    fileName: "CBC report (demo).pdf",
    patient: "Sam Taylor",
    values: {
      Hemoglobin: "138",
      "White blood cells": "6.4",
      Platelets: "250",
      Hematocrit: "0.41",
      RBC: "4.6",
    },
    status: "Pending doctor verification",
  },
  {
    id: 2,
    date: "2026-10-20",
    fileName: "Manual CBC entry",
    patient: "Jamie Lee",
    values: {
      Hemoglobin: "129",
      "White blood cells": "7.1",
      Platelets: "275",
      Hematocrit: "0.39",
      RBC: "4.3",
    },
    status: "Verified",
  },
];

export default function DoctorLabVerification() {
  const [labs, setLabs] = useState(demoLabs);

  function verify(id) {
    setLabs(
      labs.map((lab) =>
        lab.id === id
          ? {
              ...lab,
              status: "Verified",
              verifiedBy: "Dr. Alex Morgan",
              verifiedAt: new Date().toISOString(),
            }
          : lab,
      ),
    );
  }

  return (
    <main className="dlab-shell">
      <header className="dlab-header">
        <Link className="dlab-brand" to="/doctor">
          ✳ <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dlab-intro">
        <p className="dlab-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Lab verification</h1>
        <p className="dlab-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dlab-panel">
        {labs.length ? (
          labs.map((lab) => (
            <article className="dlab-item" key={lab.id}>
              <div className="dlab-grow">
                <b>{lab.fileName}</b>
                <small>
                  {lab.date} · Patient: {lab.patient}
                </small>

                <div className="dlab-values">
                  {Object.entries(lab.values)
                    .filter(([, value]) => value)
                    .map(([name, value]) => (
                      <span key={name}>
                        {name}: <b>{value}</b>
                      </span>
                    ))}
                </div>
              </div>

              <span
                className={`dlab-pill ${
                  lab.status === "Verified" ? "dlab-verified" : "dlab-pending"
                }`}
              >
                {lab.status}
              </span>

              {lab.status !== "Verified" && (
                <button className="dlab-btn" onClick={() => verify(lab.id)}>
                  Verify values
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="dlab-empty">
            No lab results have been submitted by patients yet.
          </div>
        )}

        <p className="dlab-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
