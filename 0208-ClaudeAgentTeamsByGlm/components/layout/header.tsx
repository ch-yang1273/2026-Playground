'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal, Github, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/', label: 'HOME', description: 'Return to base' },
  { href: '/blog', label: 'LOGS', description: 'Read blog posts' },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Terminal className="h-6 w-6 text-primary group-hover:neon-glow transition-all duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="font-heading font-bold text-lg tracking-wider">
            DEV.LOG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-heading text-sm tracking-wider transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {'<'}
              {item.label}
              {'/>'}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:text-primary transition-colors"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>

          {/* Mobile menu */}
          {isMounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur">
                <SheetHeader>
                  <SheetTitle className="font-heading">NAVIGATION</SheetTitle>
                  <SheetDescription className="font-mono text-xs">
                    &lt;system.nav&gt;
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-6">
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col space-y-1 rounded-sm border border-border/50 px-4 py-3 transition-all hover:border-primary/50 hover:bg-primary/5 ${
                          pathname === item.href
                            ? 'border-primary/50 bg-primary/10 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span className="font-heading text-sm">{item.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
