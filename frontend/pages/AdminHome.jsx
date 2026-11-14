import { useCallback, useEffect, useState } from "react";
import logo from "../logo/logopulsko.png";
import { apiFetch } from "../src/api";
import { LogoutButton, useAuth } from "../src/auth";
import "../css/AdminHome.css";

// F-019: administrator odobrava ili odbija liječnike koji čekaju.
export default function AdminHome() {
  const { user, csrfToken } = useAuth();
  const [doctors, setDoctors] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    apiFetch("/admin/doctors?status=pending")
      .then(setDoctors)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  async function review(doctor, action) {
    let body;
    if (action === "reject") {
      const reason = window.prompt(`Razlog odbijanja za ${doctor.display_name}:`);
      if (reason === null) return;
      if (!reason.trim()) {
        setError("Razlog odbijanja je obavezan.");
        return;
      }
      body = { reason: reason.trim() };
    }

    setBusyId(doctor.user_id);
    setError("");
    try {
      await apiFetch(`/admin/doctors/${doctor.user_id}/${action}`, {
        method: "POST",
        body,
        csrfToken,
      });
      setDoctors((rows) => rows.filter((row) => row.user_id !== doctor.user_id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <span className="admin-brand">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko · administrator</span>
        </span>
        <div className="auth-user">
          <span className="admin-chip">{user.display_name}</span>
          <LogoutButton />
        </div>
      </header>

      <section className="admin-panel">
        <h1>Liječnici koji čekaju odobrenje</h1>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {doctors === null && !error && <p className="admin-muted">Učitavanje…</p>}
        {doctors?.length === 0 && (
          <p className="admin-muted">Nema liječnika koji čekaju odobrenje.</p>
        )}

        {!!doctors?.length && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ime</th>
                <th>E-mail</th>
                <th>Ustanova</th>
                <th>Broj licence</th>
                <th aria-label="Akcije" />
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.user_id}>
                  <td>{doctor.display_name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.institution}</td>
                  <td>{doctor.license_number}</td>
                  <td className="admin-actions">
                    <button
                      type="button"
                      disabled={busyId === doctor.user_id}
                      onClick={() => review(doctor, "approve")}
                    >
                      Odobri
                    </button>
                    <button
                      type="button"
                      className="admin-reject"
                      disabled={busyId === doctor.user_id}
                      onClick={() => review(doctor, "reject")}
                    >
                      Odbij
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
