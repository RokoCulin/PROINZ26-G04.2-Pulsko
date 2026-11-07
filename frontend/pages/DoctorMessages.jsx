import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorMessages.css";

export default function DoctorMessages() {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState([]);

  return (
    <main className="dmsg-shell">
      <header className="dmsg-header">
        <Link className="dmsg-brand" to="/doctor">
          ✳ <span>Pulsko</span>
        </Link>

        <Link to="/doctor">← Doctor overview</Link>
      </header>

      <section className="dmsg-intro">
        <p className="dmsg-eyebrow">DOCTOR WORKSPACE</p>
        <h1>Messages</h1>
        <p className="dmsg-muted">
          Manage care activities and review patient-submitted information.
        </p>
      </section>

      <section className="dmsg-panel">
        <p className="dmsg-muted">Demo conversation with Sam Taylor.</p>

        <div className="dmsg-chat">
          <p className="dmsg-bubble">
            Hello doctor, I have uploaded my latest blood test.
          </p>

          {sent.map((message, index) => (
            <p className="dmsg-bubble dmsg-sent" key={index}>
              {message}
            </p>
          ))}
        </div>

        <form
          className="dmsg-compose"
          onSubmit={(event) => {
            event.preventDefault();

            if (!reply.trim()) return;

            setSent([...sent, reply.trim()]);
            setReply("");
          }}
        >
          <input
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Write a message..."
          />

          <button className="dmsg-btn">Send</button>
        </form>

        <p className="dmsg-disclaimer">
          Academic prototype: actions are local demo interactions. No real
          patient records, notifications or messages are sent.
        </p>
      </section>
    </main>
  );
}
