import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
const inter = Inter({ subsets: ["latin"] });
import { AuthProvider } from "@/app/context/AuthContext";
export const metadata: Metadata = {
  title: "AVD",
  description: "Gestão Recursos Humanos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="pt-BR">
        <body className={inter.className} >
          <AuthProvider >
          <main className="flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-800 "> 
          {children}

          </main>
          </AuthProvider>
          
        </body>
      </html>
  );
}