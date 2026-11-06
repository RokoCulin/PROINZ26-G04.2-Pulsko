import "../css/PatientAppointments.css";

function PatientAppointments() {
    return (
        <main className="appointments-page">
            <header className="appointments-header">
                <a className="appointments-brand" href="/patient">
                    <img src="/favicon.png" alt="" />
                    <span>Pulsko</span>
                </a>
                <a className="appointments-back" href="/patient">
                    ← Back to overview
                </a>
            </header>

            <section className="appointments-content">
                <p className="appointments-label">YOUR PATIENT SPACE</p>
                <h1>Appointments</h1>
                <p className="appointments-intro">
                    View your upcoming visits with your care team.
                </p>

                <div className="appointments-demo">
                    DEMO APPOINTMENTS · These are examples, not real bookings.
                </div>

                <div className="appointment-list">
                    <article className="appointment-card">
                        <div className="appointment-date">
                            <span>NOV</span>
                            <strong>12</strong>
                            <small>2026</small>
                        </div>
                        <div className="appointment-details">
                            <span className="appointment-status">UPCOMING</span>
                            <h2>General check-up</h2>
                            <p className="appointment-department">
                                Internal medicine
                            </p>
                            <p>
                                <strong>Dr. Ana Novak</strong>{" "}
                                <span className="appointment-time">09:30</span>
                            </p>
                            <p className="appointment-location">
                                Pulsko Health Centre · Room 204
                            </p>
                        </div>
                        <span className="appointment-type-icon">＋</span>
                    </article>

                    <article className="appointment-card">
                        <div className="appointment-date">
                            <span>NOV</span>
                            <strong>19</strong>
                            <small>2026</small>
                        </div>
                        <div className="appointment-details">
                            <span className="appointment-status">UPCOMING</span>
                            <h2>Follow-up visit</h2>
                            <p className="appointment-department">Cardiology</p>
                            <p>
                                <strong>Dr. Marko Kovač</strong>{" "}
                                <span className="appointment-time">11:00</span>
                            </p>
                            <p className="appointment-location">
                                Pulsko Health Centre · Room 108
                            </p>
                        </div>
                        <span className="appointment-type-icon">♡</span>
                    </article>

                    <article className="appointment-card">
                        <div className="appointment-date">
                            <span>NOV</span>
                            <strong>26</strong>
                            <small>2026</small>
                        </div>
                        <div className="appointment-details">
                            <span className="appointment-status">UPCOMING</span>
                            <h2>Therapy review</h2>
                            <p className="appointment-department">
                                Clinical pharmacy
                            </p>
                            <p>
                                <strong>Dr. Lea Horvat</strong>{" "}
                                <span className="appointment-time">14:15</span>
                            </p>
                            <p className="appointment-location">
                                Pulsko Health Centre · Room 312
                            </p>
                        </div>
                        <span className="appointment-type-icon">＋</span>
                    </article>
                </div>

                <p className="appointments-note">
                    Need to change a visit?{" "}
                    <a href="/patient/messages">Contact your care team.</a>
                </p>
            </section>
        </main>
    );
}

export default PatientAppointments;
