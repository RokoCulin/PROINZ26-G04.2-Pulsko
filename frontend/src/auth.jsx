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
    return <p className="auth-gate-loading">Loading…</p>;
  }
  if (state.status === "error") {
    return (
      <AuthMessage title="The server is not available">
        Please try again in a few moments.
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
              ? "Your doctor account request was rejected"
              : "Your account is awaiting administrator approval"
          }
        >
          {me.user.approval_status === "rejected"
            ? "The administrator did not approve your doctor account. Please contact the administrator for more information."
            : "An administrator has to check your institution and licence number. After approval you will be able to open your dashboard."}
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
      Log out
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
