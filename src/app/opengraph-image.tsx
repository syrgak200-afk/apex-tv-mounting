import { ImageResponse } from "next/og";

export const alt = "Apex TV Mounting & Installation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#173c35", color: "white", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "76px" }}>
      <div style={{ color: "#d7f35a", display: "flex", fontSize: 28, fontWeight: 800, letterSpacing: 8 }}>APEX TV MOUNTING</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 80, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
        <span>Precision you can see.</span><span style={{ color: "#d7f35a", fontFamily: "serif", fontStyle: "italic", fontWeight: 400 }}>Peace of mind you can feel.</span>
      </div>
      <div style={{ color: "#d7f35a", display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>LOS ANGELES &amp; ORANGE COUNTY</div>
    </div>,
    size,
  );
}
