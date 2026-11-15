import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { useAuth } from "./auth";

// F-003 / UC-3: pacijent šalje zahtjev liječniku po e-mailu i vidi status veza.
const STATUS_LABEL = {
  pending: "Pending",
  accepted: "Connected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  ended: "Ended",
};

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function MyDoctorSection() {
  const { csrfToken } = useAuth();
  const [links, setLinks] = useState(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    apiFetch("/patient/doctors")
      .then(setLinks)
      .catch((error) => setMessage({ type: "error", text: error.message }));
  }, []);

  async function send(event) {
    event.preventDefault();
    setSending(true);
    setMessage({ type: "", text: "" });
    try {
      const link = await apiFetch("/patient/doctors", {
        method: "POST",
        body: { doctor_email: email.trim() },
        csrfToken,
      });
      setLinks((current) => [link, ...(current ?? [])]);
      setEmail("");
      setMessage({ type: "ok", text: `Request sent to ${link.doctor.display_name}.` });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="phome-block phome-connect">
      <div>
        <p className="phome-eyebrow">BUILD YOUR CARE TEAM</p>
        <h2>My doctors</h2>
        <p className="phome-muted">
          Enter your doctor’s e-mail address and send a connection
          request. The doctor has to accept it.
        </p>
      </div>

      <form className="phome-link-form" onSubmit={send}>
        <label className="phome-search">
          Doctor’s e-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="e.g. ana.novak@kbc.hr"
            maxLength={320}
            required
          />
        </label>
        <button className="phome-secondary" type="submit" disabled={sending || !email.trim()}>
          {sending ? "Sending…" : "Send request"}
        </button>
      </form>

      {message.text && (
        <p
          className={message.type === "error" ? "phome-error" : "phome-status"}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      )}

      <div className="phome-results">
        {links?.map((link) => (
          <article className="phome-result" key={link.link_id}>
            <div className="phome-avatar">{initials(link.doctor.display_name)}</div>
            <div className="phome-grow">
              <b>{link.doctor.display_name}</b>
              <small>
                {link.doctor.institution} · {link.doctor.email}
              </small>
            </div>
            <span className={`phome-link-status phome-link-${link.status}`}>
              {STATUS_LABEL[link.status] ?? link.status}
            </span>
          </article>
        ))}

        {links?.length === 0 && (
          <p className="phome-muted">You are not connected with any doctor yet.</p>
        )}
      </div>
    </section>
  );
}
