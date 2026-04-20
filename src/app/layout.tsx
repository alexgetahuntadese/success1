import type { Metadata } from "next";
import "@/index.css";
import LayoutClient from "../app/layout-client";

export const metadata: Metadata = {
  title: "Simple Road",
  description: "Ethiopian education quiz and study platform",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
