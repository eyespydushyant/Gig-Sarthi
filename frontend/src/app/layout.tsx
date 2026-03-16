import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GigSarthi – AI Assistant for Gig Workers",
  description:
    "Predict your daily earnings, find the best time to work, and get real-time demand alerts powered by AI.",
  keywords: ["gig workers", "earnings prediction", "delivery", "ride-share", "AI assistant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
