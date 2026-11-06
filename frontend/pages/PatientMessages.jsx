import { useState } from "react";
import "../css/PatientMessages.css";

const doctors = [
    {
        id: 1,
        name: "Dr. Ana Novak",
        department: "Internal medicine",
        initials: "AN",
    },
    {
        id: 2,
        name: "Dr. Marko Kovač",
        department: "Cardiology",
        initials: "MK",
    },
    {
        id: 3,
        name: "Dr. Lea Horvat",
        department: "Clinical pharmacy",
        initials: "LH",
    },
];

function PatientMessages() {
    const [selectedDoctor, setSelectedDoctor] = useState(1);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState({
        1: [
            {
                sender: "doctor",
                text: "Hello! Feel free to send me a message here.",
            },
        ],
        2: [
            {
                sender: "doctor",
                text: "Hello! Let me know if you have a question for our next visit.",
            },
        ],
        3: [
            {
                sender: "doctor",
                text: "Hello! You can message me about your care plan.",
            },
        ],
    });

    const doctor = doctors.find((person) => person.id === selectedDoctor);

    function sendMessage(event) {
        event.preventDefault();
        if (!message.trim()) return;

        setChats({
            ...chats,
            [selectedDoctor]: [
                ...chats[selectedDoctor],
                { sender: "patient", text: message.trim() },
            ],
        });
        setMessage("");
    }

    return (
        <main className="messages-page">
            <header className="messages-header">
                <a className="messages-brand" href="/patient">
                    <img src="/favicon.png" alt="" />
                    <span>Pulsko</span>
                </a>
                <a className="messages-back" href="/patient">
                    ← Back to overview
                </a>
            </header>

            <section className="messages-content">
                <div className="messages-title">
                    <div>
                        <p className="messages-label">YOUR PATIENT SPACE</p>
                        <h1>Messages</h1>
                        <p>Choose a doctor to view your conversation.</p>
                    </div>
                    <span className="demo-label">DEMO CONVERSATIONS</span>
                </div>

                <div className="messages-layout">
                    <aside className="doctor-list">
                        <h2>Your care team</h2>
                        {doctors.map((person) => (
                            <button
                                className={
                                    selectedDoctor === person.id
                                        ? "doctor-option active"
                                        : "doctor-option"
                                }
                                key={person.id}
                                onClick={() => setSelectedDoctor(person.id)}
                            >
                                <span className="doctor-avatar">
                                    {person.initials}
                                </span>
                                <span className="doctor-summary">
                                    <strong>{person.name}</strong>
                                    <small>{person.department}</small>
                                </span>
                                <span className="doctor-arrow">›</span>
                            </button>
                        ))}
                    </aside>

                    <section className="conversation">
                        <div className="conversation-header">
                            <span className="doctor-avatar">
                                {doctor.initials}
                            </span>
                            <span>
                                <strong>{doctor.name}</strong>
                                <small>{doctor.department}</small>
                            </span>
                        </div>
                        <div className="conversation-note">
                            This is a sample conversation for the page preview.
                        </div>
                        <div className="message-list" aria-live="polite">
                            {chats[selectedDoctor].map((chat, index) => (
                                <div
                                    className={
                                        chat.sender === "patient"
                                            ? "message-row from-patient"
                                            : "message-row"
                                    }
                                    key={index}
                                >
                                    <span className="message-sender">
                                        {chat.sender === "patient"
                                            ? "You"
                                            : doctor.name}
                                    </span>
                                    <p>{chat.text}</p>
                                </div>
                            ))}
                        </div>
                        <form className="message-form" onSubmit={sendMessage}>
                            <input
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                placeholder={`Message ${doctor.name}...`}
                                aria-label={`Message ${doctor.name}`}
                            />
                            <button type="submit" disabled={!message.trim()}>
                                Send <span>↑</span>
                            </button>
                        </form>
                        <p className="messages-disclaimer">
                            Demo only: messages are not sent to a real doctor.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    );
}

export default PatientMessages;
