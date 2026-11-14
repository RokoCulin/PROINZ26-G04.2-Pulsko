import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api";
import { useAuth } from "./auth";

// F-003 / UC-5.3: zajednička logika za liječnikove veze s pacijentima
// (sekcija na /doctor, /doctor/requests i /doctor/patients).

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "numeric", year: "numeric" });

export const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

// Popis veza s backenda: "/doctor/requests" (pending) ili "/doctor/patients" (accepted).
// rows je null dok se učitava.
export function useDoctorLinkList(path) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  const reload = useCallback(
    () =>
      apiFetch(path)
        .then((data) => {
          setRows(data);
          setError("");
        })
        .catch((err) => setError(err.message)),
    [path],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, error, reload };
}

// Prihvaćanje/odbijanje zahtjeva (POST s CSRF tokenom). Nakon uspjeha zove onDone(veza).
export function useRespondToRequest(onDone) {
  const { csrfToken } = useAuth();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function respond(link, action) {
    setBusyId(link.link_id);
    setError("");
    try {
      const updated = await apiFetch(`/doctor/requests/${link.link_id}/${action}`, {
        method: "POST",
        csrfToken,
      });
      await onDone(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return { respond, busyId, error };
}
