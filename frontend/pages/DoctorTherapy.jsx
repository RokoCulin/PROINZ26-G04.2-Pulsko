import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/DoctorTherapy.css";

const demoTherapy = [
  {
    id: 1,
    name: "Example medicine A",
    time: "08:00",
    amount: "1 tablet",
    patient: "Sam Taylor",
  },
  {
    id: 2,
    name: "Example medicine B",
    time: "20:00",
    amount: "2 tablets",
    patient: "Jamie Lee",
  },
];

export default function DoctorTherapy() {
  const [med, setMed] = useState({
    name: "",
    time: "08:00",
    amount: "1 tablet",
  });

  const [therapy, setTherapy] = useState(demoTherapy);

  function saveMed(event) {
    event.preventDefault();

    setTherapy([
      ...therapy,
      {
        ...med,
        id: Date.now(),
        patient: "Sam Taylor",
      },
    ]);

    setMed({
      name: "",
      time: "08:00",
      amount: "1 tablet",
    });
  }

  return (
    <main className="dther-shell">
      <header className="dther-header">
        <Link className="dther-brand" to="/doctor">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dther-intro">
        <p className="dther-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Therapy schedules</h1>
        <p className="dther-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dther-panel">
        <form className="dther-form" onSubmit={saveMed}>
          <h3>Create medication schedule</h3>

          <label>
            Medication name
            <input
              required
              value={med.name}
              onChange={(event) =>
                setMed({
                  ...med,
                  name: event.target.value,
                })
              }
              placeholder="e.g. Example medicine"
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={med.time}
              onChange={(event) =>
                setMed({
                  ...med,
                  time: event.target.value,
                })
              }
            />
          </label>

          <label>
            Amount
            <input
              value={med.amount}
              onChange={(event) =>
                setMed({
                  ...med,
                  amount: event.target.value,
                })
              }
            />
          </label>

          <button className="dther-btn">Save schedule</button>
        </form>

        {therapy.map((item) => (
          <article className="dther-item" key={item.id}>
            <div className="dther-grow">
              <b>{item.name}</b>
              <small>
                {item.patient} · {item.amount}
              </small>
            </div>

            <span className="dther-pill">{item.time}</span>
          </article>
        ))}

        <p className="dther-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
