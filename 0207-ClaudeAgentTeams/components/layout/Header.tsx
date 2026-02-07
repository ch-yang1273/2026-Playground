"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'glass-medium border-purple-500/30 shadow-lg shadow-purple-500/10'
          : 'bg-background/95 backdrop-blur border-border supports-[backdrop-filter]:bg-background/60'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold gradient-text-primary hover:scale-105 transition-transform duration-300 group"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <span className="group-hover:drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">
            DevBlog
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="relative text-sm font-medium transition-colors hover:text-cyan-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/blog"
            className="relative text-sm font-medium transition-colors hover:text-cyan-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/about"
            className="relative text-sm font-medium transition-colors hover:text-cyan-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
          </Link>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="glass-light hover:glass-medium hover:rotate-12 transition-all duration-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.4)]"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              ) : (
                <Moon className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
