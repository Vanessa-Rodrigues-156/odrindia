import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Script from "next/script";
import GoogleScriptLoader from "@/components/GoogleScriptLoader";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ODR India",
  description: "Online Dispute Resolution Platform for India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google OAuth Script - with proper callback */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar/>
          {/* Place the loader here */}
          <GoogleScriptLoader />
          {children}
          <Footer/>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

