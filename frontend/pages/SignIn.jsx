import { useState } from "react";
import "../css/SignIn.css";

function SignIn() {
    const [role, setRole] = useState("");
    const [auth, setAuth] = useState("");
    const [message, setMessage] = useState("");

    function continueLogin() {
        if (role) {
            setMessage(
                `You selected ${role}. Connect a sign-in provider to continue.`,
            );
        }
    }

    return (
        <main className="login-page">
            <section className="login-box">
                <a className="login-logo" href="/">
                    <img src="/favicon.png" alt="logo" className="signInLogo" />
                    <p>Pulsko</p>
                </a>

                <h1>Sign in to Pulsko</h1>
                <p className="subtitle">Choose how you want to sign in.</p>

                <a
                    href="/patient"
                    className="provider-button"
                    onClick={() => setAuth("You have selected OpenID Connect")}
                >
                    <span className="openid-icon">◎</span> Continue with OpenID
                    Connect
                </a>
                <a
                    href="/patient"
                    className="provider-button"
                    onClick={() =>
                        setMessage("Connect your OAuth provider to sign in.")
                    }
                >
                    <span className="google-icon">G</span> Continue with OAuth
                    2.0
                </a>

                <div className="divider">
                    <span />
                    or
                    <span />
                </div>
                <p className="subtitle-lower">
                    If you are here for the first time
                </p>
                <h2>Select your role</h2>

                <div className="roles">
                    <button
                        className={
                            role === "Patient"
                                ? "role-card selected"
                                : "role-card"
                        }
                        onClick={() => {
                            setRole("Patient");
                            setMessage("");
                        }}
                    >
                        <span className="role-icon">♙</span>
                        <strong>Patient</strong>
                        <span>
                            Track your health, follow your therapy and stay
                            connected with your doctor.
                        </span>
                    </button>

                    <button
                        className={
                            role === "Doctor"
                                ? "role-card selected"
                                : "role-card"
                        }
                        onClick={() => {
                            setRole("Doctor");
                            setMessage("");
                        }}
                    >
                        <span className="role-icon">⚕</span>
                        <strong>Doctor</strong>
                        <span>
                            Manage your patients, review their data and
                            coordinate therapy.
                        </span>
                    </button>
                </div>

                <button
                    className="continue-button"
                    disabled={!role}
                    onClick={continueLogin}
                >
                    Continue <span>→</span>
                </button>
                <p className="message">{message}</p>
            </section>
        </main>
    );
}

export default SignIn;
