import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "THMSlash - TryHackMe Roaster",
  description: "Roast TryHackMe users based on their stats",
  generator: 'v0.dev',
  
  // Open Graph (Facebook, Discord)
  openGraph: {
    title: "THMSlash - TryHackMe Roaster",
    description: "Brutally roast TryHackMe users based on their stats. Can you handle the heat?",
    url: "https://thmslash.vercel.app/", 
    siteName: "THMSlash",
    images: [
      {
        url: "https://thmslash.vercel.app/preview.jpg", 
        width: 1200,
        height: 630,
        alt: "TryHackMe Roaster Preview"
      }
    ],
    type: "website"
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "THMSlash - TryHackMe Roaster",
    description: "Roast TryHackMe users like never before.",
    images: ["https://thmslash.vercel.app/preview.jpg"], // URL to your image
    creator: "@YourTwitterHandle" // Optional, add your Twitter handle
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" /> {/* Optional Favicon */}
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
