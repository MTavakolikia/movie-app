import type { Metadata } from "next";
import "./assets/styles/globals.css";
import Navbar from "@/app/_components/navbar";
import { ThemeProvider } from "next-themes";


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
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
