import type { Metadata } from "next";
import localFont from "next/font/local";

// CSS
import "./globals.css";

// Components
import Header from "../components/Header/Header";

// Store
import { StoreProvider } from "@/components/StoreProvider/StoreProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Catalogo de Perfumes - Brand Collection",
  description: "Catálogo online de perfumes Brand Collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
