import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import MainSidebar from "@/components/dev-components/MainSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Datafub",
  description: "Datafub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
          <div className="flex min-h-screen w-full bg-[#F5F5F5]">
            <main className="flex-1 overflow-y-auto w-full bg-[#F5F5F5]">
                 <MainSidebar >{children}</MainSidebar>
            </main>
          </div>
      </body>
    </html>
  )
}


