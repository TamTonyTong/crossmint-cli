import "@/app/globals.css"

import { Mona_Sans as FontSans } from "next/font/google"
import { Roboto_Serif as FontHeading } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata = {
  title: "CrossMint CLI - Bridge NFTs Between Ethereum & Solana",
  description:
    "A powerful command-line tool for burning NFTs on Ethereum, minting on Solana, and tracking provenance across chains.",
}

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontHeading.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
