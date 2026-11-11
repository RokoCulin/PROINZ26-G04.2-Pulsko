import { useState } from "react";
import logo from "../logo/logopulsko.png";
import "../css/PatientTherapy.css";

function PatientTherapy() {
  const [taken, setTaken] = useState([]);
  const medicines = [
    {
      id: 1,
      name: "Example medicine A",
      amount: "1 tablet",
      time: "08:00",
    },
    {
      id: 2,
      name: "Example medicine B",
      amount: "1 capsule",
      time: "13:00",
    },
    {
      id: 3,
      name: "Example medicine C",
      amount: "2 tablets",
      time: "20:00",
    },
  ];

  function confirmTaken(id) {
    setTaken([...taken, id]);
  }

  return (
    <main className="therapy-page">
      <header className="therapy-header">
        <a className="therapy-brand" href="/patient">
          <img src={logo} alt="" />
          <span>Pulsko</span>
        </a>
        <a className="therapy-back" href="/patient">
          ← Back to overview
        </a>
      </header>

      <section className="therapy-content">
        <p className="therapy-label">YOUR PATIENT SPACE</p>
        <h1>Your therapy</h1>
        <p className="therapy-intro">
          Review your medication schedule and mark a dose when you have taken
          it.
        </p>
        <div className="therapy-demo-note">
          DEMO SCHEDULE · Replace these examples with the patient's prescribed
          plan.
        </div>

        <div className="medication-list">
          {medicines.map((medicine) => (
            <article className="medication-card" key={medicine.id}>
              <div className="medicine-topline">
                <span className="medicine-icon">＋</span>
                <span className="medicine-time">{medicine.time}</span>
              </div>
              <h2>{medicine.name}</h2>
              <p>
                Amount: <strong>{medicine.amount}</strong>
              </p>
              <button
                className={
                  taken.includes(medicine.id)
                    ? "taken-button done"
                    : "taken-button"
                }
                onClick={() => confirmTaken(medicine.id)}
                disabled={taken.includes(medicine.id)}
              >
                {taken.includes(medicine.id) ? "Taken ✓" : "Confirm taken"}
              </button>
            </article>
          ))}
        </div>

        <p className="therapy-footnote">
          These are fictional examples for testing the page. Follow the
          medication plan provided by your doctor or pharmacist.
        </p>
      </section>
    </main>
  );
}

export default PatientTherapy;
