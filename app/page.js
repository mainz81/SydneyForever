"use client";

import { useEffect, useState } from "react";

const MAX_LIBRARY = 6;

export default function Home() {
  const [scene, setScene] = useState(
    "soft candlelight, confident gaze, romantic mood"
  );
  const [image, setImage] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load library from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sydney-library");
      if (stored) {
        setLibrary(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Persist library to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sydney-library", JSON.stringify(library));
    } catch {}
  }, [library]);

  async function generate() {
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Generation failed");
      }

      const src = `data:image/png;base64,${data.b64}`;
      setImage(src);
      setLibrary((prev) => [src, ...prev].slice(0, MAX_LIBRARY));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "4rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", letterSpacing: "0.05em" }}>
        Sydney Forever
      </h1>

      <p style={{ maxWidth: 720, textAlign: "center", opacity: 0.85 }}>
        A private, cinematic muse — elegant, romantic, and fully imagined.
      </p>

      <textarea
        value={scene}
        onChange={(e) => setScene(e.target.value)}
        rows={3}
        placeholder="Describe the mood or moment…"
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#0f0f14",
          border: "1px solid #2a2a35",
          color: "#f5f5f7",
          borderRadius: 14,
          padding: "1rem",
          resize: "none",
        }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{
          padding: "0.9rem 2.4rem",
          borderRadius: 999,
          border: "1px solid #3a3a4a",
          background: "linear-gradient(135deg, #2b2b38, #121218)",
          color: "#fff",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {loading ? "Creating…" : "Generate"}
      </button>

      {error && (
        <p style={{ color: "#ff6b6b", marginTop: "1rem" }}>{error}</p>
      )}

      {image && (
        <img
          src={image}
          alt="Sydney Muse"
          style={{
            marginTop: "2rem",
            maxWidth: 420,
            width: "100%",
            borderRadius: 28,
            boxShadow: "0 30px 90px rgba(0,0,0,0.85)",
          }}
        />
      )}

      {library.length > 0 && (
        <section style={{ width: "100%", marginTop: "3rem" }}>
          <h2 style={{ opacity: 0.9, marginBottom: "1rem" }}>
            Your Library
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {library.map((src, i) => (
              <a
                key={i}
                href={src}
                download={`sydney_${i + 1}.png`}
                title="Download image"
              >
                <img
                  src={src}
                  alt={`Library ${i + 1}`}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    cursor: "pointer",
                  }}
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
