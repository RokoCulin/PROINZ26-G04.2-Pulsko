import { useState } from "react";
import "../css/HealthAgent.css";

function HealthAgent() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    function sendMessage(text) {
        if (!text.trim()) return;

        setMessages([
            ...messages,
            { text: text, sender: "patient" },
            {
                text: "This chat is a preview and is not connected to an AI service yet. For personal health advice or changes to your treatment, please contact your doctor.",
                sender: "agent",
            },
        ]);
        setInput("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendMessage(input);
    }

    return (
        <main className="agent-page">
            <header className="agent-header">
                <a className="agent-brand" href="/patient">
                    <img src="/favicon.png" alt="" />
                    <span>Pulsko</span>
                </a>
                <a className="agent-back" href="/patient">
                    ← Back to overview
                </a>
            </header>

            <div className="agent-layout">
                <section className="chat-section">
                    <div className="chat-title">
                        <p className="agent-label">
                            YOUR PERSONAL HEALTH ASSISTANT
                        </p>
                        <h1>Health agent</h1>
                        <p>
                            Ask about information shared with you or prepare
                            questions for your doctor.
                        </p>
                    </div>

                    <div className="chat-box">
                        <div className="chat-messages" aria-live="polite">
                            <div className="chat-message agent-message">
                                <span className="message-icon">✳</span>
                                <p>
                                    Hi! I can help you understand your health
                                    information and get ready for a conversation
                                    with your doctor. I don’t replace medical
                                    advice.
                                </p>
                            </div>

                            {messages.map((message, index) => (
                                <div
                                    className={`chat-message ${message.sender}-message`}
                                    key={index}
                                >
                                    {message.sender === "agent" && (
                                        <span className="message-icon">✳</span>
                                    )}
                                    <p>{message.text}</p>
                                </div>
                            ))}
                        </div>

                        {messages.length === 0 && (
                            <div className="suggestions">
                                <span>Try asking</span>
                                <button
                                    onClick={() =>
                                        sendMessage(
                                            "Help me understand a health record",
                                        )
                                    }
                                >
                                    Help me understand a health record
                                </button>
                                <button
                                    onClick={() =>
                                        sendMessage(
                                            "What could I ask at my next appointment?",
                                        )
                                    }
                                >
                                    What could I ask at my next appointment?
                                </button>
                            </div>
                        )}

                        <form className="chat-form" onSubmit={handleSubmit}>
                            <input
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                placeholder="Write your question..."
                                aria-label="Write your question"
                            />
                            <button type="submit" disabled={!input.trim()}>
                                Send <span>↑</span>
                            </button>
                        </form>
                        <p className="chat-disclaimer">
                            For urgent concerns, contact your doctor or local
                            emergency services.
                        </p>
                    </div>
                </section>

                <aside className="agent-info">
                    <div className="assistant-art">
                        <span className="art-orbit orbit-a" />
                        <span className="art-orbit orbit-b" />
                        <div className="assistant-bubble">
                            <span>✳</span>
                            <small>YOUR HEALTH AGENT</small>
                            <strong>
                                Here to help
                                <br />
                                you understand.
                            </strong>
                        </div>
                        <svg
                            className="assistant-pulse"
                            viewBox="0 0 260 70"
                            aria-hidden="true"
                        >
                            <path d="M0 38 H62 L82 38 L96 18 L112 56 L131 28 L145 38 H182 L198 38 L212 21 L225 50 L238 38 H260" />
                        </svg>
                    </div>
                    <div className="agent-info-copy">
                        <p className="info-kicker">A HELPFUL PLACE TO START</p>
                        <h2>Make sense of your care.</h2>
                        <ul>
                            <li>Understand information shared with you</li>
                            <li>Prepare questions for your doctor</li>
                            <li>Review care instructions together</li>
                        </ul>
                        <p className="info-note">
                            The agent doesn’t diagnose or replace your doctor’s
                            advice.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default HealthAgent;
