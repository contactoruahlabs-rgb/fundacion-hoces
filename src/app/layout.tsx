import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito_Sans, Manrope } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Fundación HOCES — Cosechando Sueños",
    template: "%s — Fundación HOCES",
  },
  description:
    "Fundación HOCES acompaña a niños, niñas, adolescentes y familias neurodivergentes en Padre Hurtado, Región Metropolitana, a través de terapias profesionales y acompañamiento integral.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${nunitoSans.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
