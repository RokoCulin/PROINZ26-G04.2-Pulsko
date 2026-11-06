import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import PatientHome from "../pages/PatientHome.jsx";
import "./App.css";
import HealthAgent from "../pages/HealthAgent.jsx";
import PatientTherapy from "../pages/PatientTherapy.jsx";
import PatientAppointments from "../pages/PatientAppointments.jsx";
import PatientMessages from "../pages/PatientMessages.jsx";
import PatientCheckIn from "../pages/PatientCheckIn.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/signin" element={<SignIn></SignIn>} />
                <Route path="/patient" element={<PatientHome />} />
                <Route path="/patient/health-agent" element={<HealthAgent />} />
                <Route path="/patient/therapy" element={<PatientTherapy />} />
                <Route
                    path="/patient/appointments"
                    element={<PatientAppointments />}
                />
                <Route path="/patient/messages" element={<PatientMessages />} />
                <Route path="/patient/check-in" element={<PatientCheckIn />} />
            </Routes>
        </>
    );
}

export default App;
