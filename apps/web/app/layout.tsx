

import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { MainProvider } from "@/components/providers/main"


const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
      
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <MainProvider>


          {children}
          
        </MainProvider>
      </body>
    </html>
  )
}
