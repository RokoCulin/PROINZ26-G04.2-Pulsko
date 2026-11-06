import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import PatientHome from "../pages/PatientHome.jsx";
import "./App.css";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/signin" element={<SignIn></SignIn>} />
                <Route path="/patient" element={<PatientHome />} />
            </Routes>
        </>
    );
}

export default App;
