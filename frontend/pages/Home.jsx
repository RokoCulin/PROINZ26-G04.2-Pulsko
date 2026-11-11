import { Link } from "react-router-dom";
import logo from "../logo/logopulsko.png";
import "../css/Home.css";

const features = [
  {
    number: "01",
    icon: "connect",
    title: "Connect",
    text: "Talk to your care team whenever you need them.",
  },
  {
    number: "02",
    icon: "track",
    title: "Track",
    text: "Keep your health information together in one place.",
  },
  {
    number: "03",
    icon: "manage",
    title: "Manage",
    text: "Stay on top of your treatment and daily care.",
  },
  {
    number: "04",
    icon: "calendar",
    title: "Keep up",
    text: "Know what is coming with clear appointment reminders.",
  },
];

function FeatureIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (type === "connect")
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
        <circle cx="20" cy="20" r="12" />
        <path d="m29 29 10 10M16 20h8m-4-4v8" />
      </svg>
    );
  if (type === "track")
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
        <path d="M24 39S8 29 8 18a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 11-16 21-16 21Z" />
        <path d="M13 23h7l3-5 4 10 3-5h5" />
      </svg>
    );
  if (type === "manage")
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
        <path d="M17 31 31 17a8 8 0 0 1 11 11L28 42a8 8 0 0 1-11-11ZM31 17 17 31a8 8 0 0 1-11-11L20 6A8 8 0 0 1 31 17Z" />
        <path d="m15 24 9 9" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
      <rect x="7" y="11" width="34" height="30" rx="5" />
      <path d="M15 6v10m18-10v10M7 20h34m-26 8h6m-6 6h14" />
    </svg>
  );
}

function Home() {
  return (
    <main className="pulsko-page">
      <header className="topbar">
        <Link className="wordmark" to="/">
          <img src={logo} alt="Pulsko logo" />
          <span>Pulsko</span>
        </Link>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#about">About Pulsko</a>
        </nav>
        <a className="signin-button" href="/signin">
          Sign in <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="welcome">
        <div className="welcome-copy">
          <div className="availability">
            <span className="availability-dot" /> YOUR CARE, CONNECTED
          </div>
          <h1>Feel better about managing your health.</h1>
          <p className="welcome-description">
            One simple place to stay connected with your doctor, understand your
            health and keep your care moving forward.
          </p>
        </div>

        <div
          className="care-visual"
          aria-label="A preview of your Pulsko health overview"
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="health-card">
            <div className="health-card-top">
              <span className="health-label">YOUR HEALTH</span>
              <span className="health-menu">•••</span>
            </div>
            <div className="health-greeting">
              Good morning, Alex <span>✳</span>
            </div>
            <p className="health-subtitle">Here’s your care at a glance.</p>
            <div className="health-score">
              <div className="score-ring">
                <div>
                  <strong>✓</strong>
                  <small>ON TRACK</small>
                </div>
              </div>
              <div className="score-copy">
                <strong>Looking good</strong>
                <span>Your care plan is up to date.</span>
              </div>
            </div>
            <div className="next-visit">
              <div className="visit-icon">✚</div>
              <div>
                <small>NEXT APPOINTMENT</small>
                <strong>Dr. Morgan Lee</strong>
                <span>Thursday · 10:30 AM</span>
              </div>
              <span className="visit-arrow">↗</span>
            </div>
          </div>
          <div className="floating-note">
            <span className="floating-check">✓</span>
            <span>
              <strong>All caught up</strong>
              <small>Your next step is scheduled</small>
            </span>
          </div>
          <div className="visual-caption">
            <span /> HEALTHCARE THAT MOVES WITH YOU
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <p className="section-kicker">ONE PLACE FOR YOUR CARE</p>
            <h2>Feel supported at every step.</h2>
          </div>
          <p className="section-intro">
            Small things add up. Pulsko helps make everyday health management
            feel a little simpler.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-card-top">
                <span className="feature-icon">
                  <FeatureIcon type={feature.icon} />
                </span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="page-footer" id="about">
        <a className="footer-brand" href="#home">
          Pulsko
        </a>
        <span>Care feels better when we’re connected.</span>
        <span>© 2026 Pulsko</span>
      </footer>
    </main>
  );
}

export default Home;
