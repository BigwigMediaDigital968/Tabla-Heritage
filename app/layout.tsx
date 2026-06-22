import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./component/website/SmoothScroll";
import ChatBot from "./component/website/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Tabla Heritage | School of Rhythm | Tabla, Dholak Lessons & Cultural Events",
  description:
    "Discover the art of Indian percussion at Tabla Heritage. Join professional Tabla and Dholak lessons, organize the cultural events and programs, and experience the rich heritage of Indian music through expert guidance and interactive learning.",
  icons: {
    icon: "/logo-tabla-heritage.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
          <ChatBot />
        </SmoothScroll>
      </body>
    </html>
  );
}
