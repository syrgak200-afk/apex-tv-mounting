import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apex TV Mounting",
  description: "Professional TV mounting services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
