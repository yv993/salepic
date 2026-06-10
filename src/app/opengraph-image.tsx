import { ImageResponse } from "next/og";

export const alt = "Posted. — original hand-illustrated postcards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(60% 80% at 80% 10%, rgba(217, 164, 65,0.22), transparent 60%), #0b0b0d",
          color: "#ece8e1",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#d9a441",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "3px dashed #d9a441",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            P
          </div>
          Posted.
        </div>
        <div style={{ marginTop: 28, fontSize: 86, fontWeight: 700, lineHeight: 1.05 }}>
          Little postcards,
        </div>
        <div style={{ fontSize: 86, fontWeight: 700, fontStyle: "italic", color: "#d9a441", lineHeight: 1.05 }}>
          big somewhere-elses.
        </div>
        <div style={{ marginTop: 30, fontSize: 32, color: "#b8a88f", fontFamily: "Helvetica, Arial, sans-serif" }}>
          Original hand-illustrated postcards · printed in small batches
        </div>
      </div>
    ),
    { ...size },
  );
}
