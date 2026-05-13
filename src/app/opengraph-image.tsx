import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EraMarque — Curated Classics & Beautiful Cars";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f5f5f4",
            letterSpacing: "-2px",
          }}
        >
          ERAMARQUE
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#f59e0b",
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          Curated Classics & Beautiful Cars
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#a8a29e",
            marginTop: 40,
          }}
        >
          yt-pay.io
        </div>
      </div>
    ),
    { ...size }
  );
}
