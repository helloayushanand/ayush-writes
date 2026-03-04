import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ayush.writes",
  description: "Ayush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Ambient background: drifting blobs + rising particles */}
        <div className="bg-canvas" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
          <span className="particle p1">✒️</span>
          <span className="particle p2">📖</span>
          <span className="particle p3">🌸</span>
          <span className="particle p4">🍃</span>
          <span className="particle p5">🌱</span>
          <span className="particle p6">🕊️</span>
          <span className="particle p7">🌿</span>
          <span className="particle p8">📝</span>
          <span className="particle p9">🌙</span>
          <span className="particle p10">🦋</span>
          <span className="particle p11">🌺</span>
          <span className="particle p12">✒️</span>
          <span className="particle p13">🍂</span>
          <span className="particle p14">🌾</span>
          <span className="particle p15">📖</span>
          <span className="particle p16">🌸</span>
          <span className="particle p18">🌊</span>
        </div>
        {children}
      </body>
    </html>
  );
}
