import "../css/PatientHome.css";

function PatientHome() {
    return (
        <main className="patient-page">
            <header className="patient-header">
                <a className="patient-brand" href="/patient">
                    <img src="/favicon.png" alt="" />
                    <span>Pulsko</span>
                </a>
                <div className="patient-profile">
                    <span>[S]</span> [IME]{" "}
                    {/* ==================================== slika i ime pacijenta učitaj */}
                </div>
            </header>

            <section className="home-hero">
                <div className="hero-copy">
                    <p className="eyebrow">YOUR PATIENT SPACE</p>
                    <h1>Good to see you, [IME]</h1>{" "}
                    {/* ==================================== tu treba dodati ime pacijenta, tj. da se ucitava direkt */}
                    <p>
                        Keep your care organized and stay connected with your
                        doctor. What would you like to do today?
                    </p>
                    <a className="hero-button" href="/patient/check-in">
                        Start daily check-in <span>→</span>
                    </a>
                </div>
                <div
                    className="hero-art"
                    aria-label="Decorative health illustration"
                >
                    <div className="art-circle circle-one" />
                    <div className="art-circle circle-two" />
                    <div className="health-preview">
                        <div className="preview-heading">
                            <span className="preview-icon">+</span>
                            <div>
                                <strong>Your health space</strong>
                                <small>Connected care, in one place</small>
                            </div>
                        </div>
                        <svg
                            className="pulse-graphic"
                            viewBox="0 0 420 130"
                            aria-hidden="true"
                        >
                            <path d="M0 70 H105 L135 70 L154 34 L181 104 L209 58 L229 70 H278 L302 70 L322 43 L344 93 L365 70 H420" />
                        </svg>
                        <div className="preview-bottom">
                            <span>YOUR CARE TEAM</span>
                            <span className="connected-dot" /> Connected
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-area">
                <div className="section-title">
                    <div>
                        <p className="eyebrow">YOUR CARE TOOLS</p>
                        <h2>Where would you like to go?</h2>
                    </div>
                    <span>Choose a section to get started</span>
                </div>

                <div className="home-links" aria-label="Patient features">
                    <a className="home-card" href="/patient/check-in">
                        <span className="home-icon">☺</span>
                        <h3>Daily check-in</h3>
                        <p>Save a note about how you feel today.</p>
                        <span className="card-arrow">→</span>
                    </a>
                    <a className="home-card" href="/patient/health-agent">
                        <span className="home-icon">⌁</span>
                        <h3>Health agent</h3>
                        <p>
                            Any uncertainties you have can be resolved with the
                            help of your personal health assistant.
                        </p>
                        <span className="card-arrow">→</span>
                    </a>
                    <a className="home-card" href="/patient/therapy">
                        <span className="home-icon">＋</span>
                        <h3>Therapy</h3>
                        <p>See the therapy details your doctor has shared.</p>
                        <span className="card-arrow">→</span>
                    </a>
                    <a className="home-card" href="/patient/appointments">
                        <span className="home-icon">□</span>
                        <h3>Appointments</h3>
                        <p>Keep track of visits with your care team.</p>
                        <span className="card-arrow">→</span>
                    </a>
                    <a className="home-card" href="/patient/messages">
                        <span className="home-icon">✉</span>
                        <h3>Messages</h3>
                        <p>Get in touch with your connected doctor.</p>
                        <span className="card-arrow">→</span>
                    </a>
                    <div className="help-card">
                        <span className="home-icon">i</span>
                        <h3>Care information</h3>
                        <p>
                            Pulsko helps you review shared information. Your
                            doctor remains your source for medical advice.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="patient-footer">
                <span>Pulsko · Care feels better when we’re connected.</span>
            </footer>
        </main>
    );
}

export default PatientHome;
