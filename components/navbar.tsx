"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Code2, BarChart2, LineChart, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  {
    name: "Code Analyzer",
    href: "/",
    icon: <Code2 className="h-5 w-5 mr-2" />,
  },
  {
    name: "Algorithm Visualizer",
    href: "/algorithm-visualizer",
    icon: <BarChart2 className="h-5 w-5 mr-2" />,
  },
  {
    name: "Performance Metrics",
    href: "/performance-metrics",
    icon: <LineChart className="h-5 w-5 mr-2" />,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-purple-500 animate-pulse-slow" />
              <Code2 className="absolute inset-0 h-5 w-5 m-1.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight font-heading">
              Code<span className="text-primary">Viz </span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              asChild
              className={cn(
                "h-9 px-4 transition-all duration-200",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Link href={item.href} className="flex items-center">
                {item.icon}
                <span>{item.name}</span>
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ModeToggle />

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md"
          >
            <div className="container py-4 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="flex items-center">
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

