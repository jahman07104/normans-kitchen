import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Norman's Kitchen | Diaspora Cookshop Platform",
  description:
    "A Jamaican cookshop-focused web app starter for storefront ordering and kitchen operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
