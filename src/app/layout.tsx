import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Crypto Hub",
  description: "Conecta con profesionales cripto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0B1324] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
