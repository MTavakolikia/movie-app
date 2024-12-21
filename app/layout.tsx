import type { Metadata } from "next";
import "./assets/styles/globals.css";
import Navbar from "@/components/navbar";


export const metadata: Metadata = {
  title: "Movie App",
  description: "An app for introducing movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
