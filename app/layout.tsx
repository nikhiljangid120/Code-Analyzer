import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "CodeViz | Advanced Code Analyzer & Algorithm Visualizer",
  description: "Analyze code, visualize algorithms, and get AI-powered insights with stunning visualizations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, poppins.variable, "font-sans min-h-screen antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen flex flex-col">
            {/* Background gradient effect */}
            <div className="fixed inset-0 bg-background z-[-1]">
              <div className="absolute inset-0 opacity-30 bg-grid-white/[0.2] -z-10" />
              <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-r from-rose-500/20 via-violet-500/20 to-indigo-500/20 blur-[100px] -z-10" />
            </div>

            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>

            <footer className="border-t border-border/40 py-6 backdrop-blur-sm">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} CodeViz. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'