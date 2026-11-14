import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import { apiFetch, getMe, homePathFor } from "./api";
import "./auth.css";

const AuthContext = createContext(null);

// Prijavljeni korisnik ({ user, csrfToken }) za stranice unutar <RequireRole>.
export function useAuth() {
  return useContext(AuthContext);
}

// Zaštita ruta: pušta samo prijavljenog korisnika zadane uloge.
// Neprijavljeni -> /signin, druga uloga -> njegova nadzorna ploča,
// liječnik koji nije odobren -> poruka da čeka odobrenje.
export function RequireRole({ role }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let active = true;
    getMe()
      .then((me) => active && setState({ status: "done", me }))
      .catch(() => active && setState({ status: "error" }));
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") {
    return <p className="auth-gate-loading">Učitavanje…</p>;
  }
  if (state.status === "error") {
    return (
      <AuthMessage title="Backend nije dostupan">
        Pokušajte ponovno za nekoliko trenutaka.
      </AuthMessage>
    );
  }

  const { me } = state;
  if (!me.authenticated) return <Navigate to="/signin" replace />;
  if (me.user.role !== role) return <Navigate to={homePathFor(me.user)} replace />;

  const value = { user: me.user, csrfToken: me.csrf_token };

  if (role === "doctor" && me.user.approval_status !== "approved") {
    return (
      <AuthContext.Provider value={value}>
        <AuthMessage
          title={
            me.user.approval_status === "rejected"
              ? "Zahtjev za liječnički račun je odbijen"
              : "Vaš račun čeka odobrenje administratora"
          }
        >
          {me.user.approval_status === "rejected"
            ? "Administrator nije odobrio vaš liječnički račun. Za više informacija javite se administratoru."
            : "Administrator mora provjeriti podatke o ustanovi i broju licence. Nakon odobrenja moći ćete pristupiti nadzornoj ploči."}
        </AuthMessage>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export function LogoutButton({ className = "auth-logout" }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await apiFetch("/auth/logout", { method: "POST", csrfToken: auth?.csrfToken });
    } catch {
      // I ako odjava ne uspije (npr. sesija je već istekla), korisnik ide na prijavu.
    }
    navigate("/signin", { replace: true });
  }

  return (
    <button type="button" className={className} onClick={logout} disabled={busy}>
      Odjava
    </button>
  );
}

function AuthMessage({ title, children }) {
  const auth = useAuth();
  return (
    <main className="auth-gate">
      <section className="auth-gate-card">
        <img src={logo} alt="Pulsko logo" />
        <h1>{title}</h1>
        <p>{children}</p>
        {auth && <LogoutButton className="auth-gate-btn" />}
      </section>
    </main>
  );
}
