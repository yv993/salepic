import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1410",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            border: "5px dashed #e0913a",
            color: "#e0913a",
            fontSize: 92,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size },
  );
}
