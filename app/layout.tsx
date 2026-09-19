import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { ToastProvider } from "@/components/Toast";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupportWidget } from "@/components/SupportWidget";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Top-Up Pharmacy — Whatever you need, 24/7", template: "%s · Top-Up Pharmacy" },
  description: "Order medicines, upload prescriptions and track deliveries from Top-Up Pharmacy, Ghana.",
};
export const viewport: Viewport = { themeColor: "#e6eafb", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-dvh antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <SmoothScroll />
              <Header />
              <main>{children}</main>
              <Footer />
              <SupportWidget />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
