"use client";

import { useEffect } from "react";

/**
 * Root error boundary — replaces the whole document if the root layout itself
 * throws, so it must render its own <html>/<body>. Intentionally dependency-free
 * and inline-styled (no theme/providers available here).
 */
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0b0d",
          color: "#ece8e1",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem", fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a39c93", margin: "0 0 1.5rem" }}>
            The page hit an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              cursor: "pointer",
              borderRadius: "0.75rem",
              border: "none",
              background: "#d9a441",
              color: "#161310",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
