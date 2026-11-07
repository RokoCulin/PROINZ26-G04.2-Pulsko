import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/PatientLabs.css";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem("pulsko-labs")) || [];
  } catch {
    return [];
  }
};

function formatTime(item) {
  if (!item.uploadedAt) return item.date || "";

  return new Date(item.uploadedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PatientLabs() {
  const [labs, setLabs] = useState(read);
  const [files, setFiles] = useState([]);
  const [inputKey, setInputKey] = useState(0);

  function save(event) {
    event.preventDefault();

    if (!files.length) return;

    const uploadedAt = new Date().toISOString();

    const added = files.map((name, index) => ({
      id: Date.now() + index,
      fileName: name,
      uploadedAt,
    }));

    const next = [...labs, ...added];

    setLabs(next);
    localStorage.setItem("pulsko-labs", JSON.stringify(next));

    setFiles([]);
    setInputKey(inputKey + 1);
  }

  return (
    <main className="plabs-shell">
      <header className="plabs-header">
        <Link className="plabs-brand" to="/patient">
          ✳ <span>Pulsko</span>
        </Link>
        <Link to="/patient">← Back to overview</Link>
      </header>

      <section className="plabs-intro">
        <p className="plabs-eyebrow">HEALTH RECORDS</p>
        <h1>Lab results</h1>
        <p className="plabs-muted">
          Upload your lab reports. In this demo only the file name and the time
          of upload are saved in this browser.
        </p>
      </section>

      <form className="plabs-panel" onSubmit={save}>
        <h2>Upload a lab report</h2>

        <label>
          Report files
          <input
            key={inputKey}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event) =>
              setFiles(Array.from(event.target.files).map((file) => file.name))
            }
          />
        </label>

        <button className="plabs-btn" type="submit" disabled={!files.length}>
          Upload →
        </button>
      </form>

      <section className="plabs-panel">
        <div>
          <p className="plabs-eyebrow">YOUR HISTORY</p>
          <h2>Uploaded reports</h2>
        </div>

        {labs.length ? (
          labs
            .slice()
            .reverse()
            .map((item) => (
              <article className="plabs-row" key={item.id}>
                <b>{item.fileName}</b>
                <small>Uploaded {formatTime(item)}</small>
              </article>
            ))
        ) : (
          <div className="plabs-empty">No lab reports uploaded yet.</div>
        )}
      </section>
    </main>
  );
}
