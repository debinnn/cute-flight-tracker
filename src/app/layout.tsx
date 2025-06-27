import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Tracker ✈️ - IX 322",
  description: "Cute flight tracker for IX 322 with kawaii design and real-time updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}