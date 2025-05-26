import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ToastProvider } from '@/components/ui/use-toast'
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from '@/lib/auth';

// Configure Geist fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "ODR - Online Dispute Resolution",
  description: "Providing innovative online solutions for Alternative Dispute Resolution (ADR) practices and justice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Wrap the app in the AuthProvider */}
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
      
