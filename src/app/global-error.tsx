"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#F5EDD6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
              fontSize: 28,
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
              color: "#F5EDD6",
            }}
          >
            Erreur critique
          </h1>
          <p style={{ color: "#6B6B6B", marginBottom: 32, lineHeight: 1.6 }}>
            Une erreur inattendue est survenue. Veuillez rafraîchir la page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#C9A84C",
              color: "#0A0A0A",
              border: "none",
              borderRadius: 8,
              padding: "14px 32px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Rafraîchir la page
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: 40,
                fontSize: 11,
                color: "#6B6B6B",
                fontFamily: "monospace",
              }}
            >
              Réf: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
