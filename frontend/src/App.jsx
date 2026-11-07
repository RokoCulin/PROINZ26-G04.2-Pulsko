import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import PatientHome from "../pages/PatientHome";
import PatientCheckIn from "../pages/PatientCheckIn";
import PatientLabs from "../pages/PatientLabs";
import DoctorHome from "../pages/DoctorHome";
import DoctorPatients from "../pages/DoctorPatients";
import DoctorRequests from "../pages/DoctorRequests";
import DoctorAppointments from "../pages/DoctorAppointments";
import DoctorMessages from "../pages/DoctorMessages";
import DoctorTherapy from "../pages/DoctorTherapy";
import DoctorLabVerification from "../pages/DoctorLabVerification";

import HealthAgent from "../pages/HealthAgent";
import PatientTherapy from "../pages/PatientTherapy";
import PatientAppointments from "../pages/PatientAppointments";
import PatientMessages from "../pages/PatientMessages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/signin" element={<SignIn />} />

      {/* PATIENT */}
      <Route path="/patient" element={<PatientHome />} />
      <Route path="/patient/check-in" element={<PatientCheckIn />} />
      <Route path="/patient/labs" element={<PatientLabs />} />
      <Route path="/patient/health-agent" element={<HealthAgent />} />
      <Route path="/patient/therapy" element={<PatientTherapy />} />
      <Route path="/patient/appointments" element={<PatientAppointments />} />
      <Route path="/patient/messages" element={<PatientMessages />} />

      {/* DOCTOR */}
      <Route path="/doctor" element={<DoctorHome />} />
      <Route path="/doctor/patients" element={<DoctorPatients />} />
      <Route path="/doctor/requests" element={<DoctorRequests />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/messages" element={<DoctorMessages />} />
      <Route path="/doctor/therapy" element={<DoctorTherapy />} />
      <Route path="/doctor/lab-results" element={<DoctorLabVerification />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
