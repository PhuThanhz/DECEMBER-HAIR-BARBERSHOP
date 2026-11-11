import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#2b211c",
        color: "#f6f2ec",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 150, letterSpacing: -2, color: "#d9c27a" }}>December</div>
      <div
        style={{
          marginTop: 16,
          fontSize: 26,
          letterSpacing: 18,
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        Barber Shop
      </div>
    </div>,
    size,
  );
}
