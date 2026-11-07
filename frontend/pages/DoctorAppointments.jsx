import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorAppointments.css";

const demoAppointments = [
  {
    id: 1,
    patient: "Sam Taylor",
    date: "2026-11-12",
    time: "09:30",
    reason: "General check-up",
  },
  {
    id: 2,
    patient: "Jamie Lee",
    date: "2026-11-19",
    time: "11:00",
    reason: "Cardiology follow-up",
  },
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(demoAppointments);

  const [appointment, setAppointment] = useState({
    patient: "Sam Taylor",
    date: "",
    time: "09:00",
    reason: "Follow-up",
  });

  function save(event) {
    event.preventDefault();

    setAppointments([
      ...appointments,
      {
        ...appointment,
        id: Date.now(),
      },
    ]);

    setAppointment({
      ...appointment,
      date: "",
      time: "09:00",
    });
  }

  return (
    <main className="dapp-shell">
      <header className="dapp-header">
        <Link className="dapp-brand" to="/doctor">
          ✳ <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dapp-intro">
        <p className="dapp-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Appointments</h1>
        <p className="dapp-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dapp-panel">
        <form className="dapp-form" onSubmit={save}>
          <h3>Create appointment</h3>

          <label>
            Patient
            <input
              value={appointment.patient}
              onChange={(event) =>
                setAppointment({
                  ...appointment,
                  patient: event.target.value,
                })
              }
            />
          </label>

          <label>
            Date
            <input
              type="date"
              required
              value={appointment.date}
              onChange={(event) =>
                setAppointment({
                  ...appointment,
                  date: event.target.value,
                })
              }
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={appointment.time}
              onChange={(event) =>
                setAppointment({
                  ...appointment,
                  time: event.target.value,
                })
              }
            />
          </label>

          <label>
            Reason
            <input
              value={appointment.reason}
              onChange={(event) =>
                setAppointment({
                  ...appointment,
                  reason: event.target.value,
                })
              }
            />
          </label>

          <button className="dapp-btn">Add appointment</button>
        </form>

        {appointments.map((item) => (
          <article className="dapp-item" key={item.id}>
            <div className="dapp-grow">
              <b>
                {item.patient} · {item.reason}
              </b>
              <small>
                {item.date} at {item.time}
              </small>
            </div>

            <span className="dapp-pill">Scheduled</span>
          </article>
        ))}

        <p className="dapp-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
