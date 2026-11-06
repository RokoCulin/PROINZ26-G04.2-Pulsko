import { useState } from "react";
import "../css/PatientCheckIn.css";

function PatientCheckIn() {
    const [symptoms, setSymptoms] = useState([]);
    const [physicalNote, setPhysicalNote] = useState("");
    const [mood, setMood] = useState("");
    const [emotionalNote, setEmotionalNote] = useState("");
    const [saved, setSaved] = useState(false);

    function toggleSymptom(symptom) {
        if (symptoms.includes(symptom)) {
            setSymptoms(symptoms.filter((item) => item !== symptom));
        } else {
            setSymptoms([...symptoms, symptom]);
        }
        setSaved(false);
    }

    function submitCheckIn(event) {
        event.preventDefault();
        setSaved(true);
    }

    return (
        <main className="checkin-page">
            <header className="checkin-header">
                <a className="checkin-brand" href="/patient">
                    <img src="/favicon.png" alt="" />
                    <span>Pulsko</span>
                </a>
                <a className="checkin-back" href="/patient">
                    ← Back to overview
                </a>
            </header>

            <section className="checkin-content">
                <p className="checkin-label">YOUR PATIENT SPACE</p>
                <h1>Daily check-in</h1>
                <p className="checkin-intro">
                    Take a moment to note how you are feeling today.
                </p>

                <form className="checkin-form" onSubmit={submitCheckIn}>
                    <section className="checkin-section">
                        <div className="checkin-section-heading">
                            <span className="checkin-icon">＋</span>
                            <div>
                                <h2>Physical wellbeing</h2>
                                <p>
                                    Have you noticed any physical symptoms
                                    today?
                                </p>
                            </div>
                        </div>
                        <div className="symptom-options">
                            {[
                                "Pain",
                                "Fatigue",
                                "Nausea",
                                "Sleep issues",
                                "Other",
                            ].map((symptom) => (
                                <label
                                    className={
                                        symptoms.includes(symptom)
                                            ? "symptom-option chosen"
                                            : "symptom-option"
                                    }
                                    key={symptom}
                                >
                                    <input
                                        type="checkbox"
                                        checked={symptoms.includes(symptom)}
                                        onChange={() => toggleSymptom(symptom)}
                                    />
                                    {symptom}
                                </label>
                            ))}
                        </div>
                        <label className="field-label" htmlFor="physical-note">
                            Anything else you would like to note?{" "}
                            <span>Optional</span>
                        </label>
                        <textarea
                            id="physical-note"
                            value={physicalNote}
                            onChange={(event) => {
                                setPhysicalNote(event.target.value);
                                setSaved(false);
                            }}
                            placeholder="Write a short note about how you feel physically..."
                            rows="3"
                        />
                    </section>

                    <section className="checkin-section">
                        <div className="checkin-section-heading">
                            <span className="checkin-icon">♡</span>
                            <div>
                                <h2>Emotional wellbeing</h2>
                                <p>
                                    How would you describe your emotional state
                                    today?
                                </p>
                            </div>
                        </div>
                        <div className="mood-options">
                            {[
                                "Good",
                                "Okay",
                                "Worried",
                                "Low",
                                "Overwhelmed",
                            ].map((option) => (
                                <label
                                    className={
                                        mood === option
                                            ? "mood-option chosen"
                                            : "mood-option"
                                    }
                                    key={option}
                                >
                                    <input
                                        type="radio"
                                        name="mood"
                                        value={option}
                                        checked={mood === option}
                                        onChange={() => {
                                            setMood(option);
                                            setSaved(false);
                                        }}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        <label className="field-label" htmlFor="emotional-note">
                            Would you like to add anything?{" "}
                            <span>Optional</span>
                        </label>
                        <textarea
                            id="emotional-note"
                            value={emotionalNote}
                            onChange={(event) => {
                                setEmotionalNote(event.target.value);
                                setSaved(false);
                            }}
                            placeholder="Add any thoughts you would like to remember or share..."
                            rows="3"
                        />
                    </section>

                    <div className="checkin-bottom">
                        <p>
                            This check-in is not a diagnosis and does not
                            replace medical advice.
                        </p>
                        <button className="checkin-submit" type="submit">
                            Save check-in <span>→</span>
                        </button>
                    </div>
                    {saved && (
                        <p className="checkin-success" role="status">
                            Your check-in is complete for this session. It is
                            not saved after you leave the page.
                        </p>
                    )}
                </form>

                <p className="checkin-safety">
                    If you feel unsafe or need urgent help, contact your care
                    team or local emergency services.
                </p>
            </section>
        </main>
    );
}

export default PatientCheckIn;
