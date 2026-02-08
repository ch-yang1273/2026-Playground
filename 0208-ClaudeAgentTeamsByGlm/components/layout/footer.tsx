import Link from 'next/link'
import { Terminal, Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/20 bg-background/50 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Terminal className="h-6 w-6 text-primary group-hover:neon-glow transition-all duration-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
              <span className="font-heading font-bold">DEV.LOG</span>
            </Link>
            <p className="text-sm text-muted-foreground font-light">
              Digital journal documenting experiments in web development, design, and emerging technology.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary text-sm">&lt;nav/&gt;</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors font-mono">
                  {'<home/>'}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-mono">
                  {'<logs/>'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary text-sm">&lt;connect/&gt;</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 font-mono"
                >
                  <Github className="h-4 w-4" />
                  GITHUB_REPO
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary text-sm">&lt;legal/&gt;</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
              <li>© {currentYear} DEV.LOG</li>
              <li>BUILT_WITH_NEXTJS_16</li>
              <li className="text-accent">SYSTEM_ONLINE</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="font-mono text-xs text-muted-foreground">
              &lt;end_of_transmission /&gt;
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              POWERED_BY_CLAUDE_AGENT_TEAMS
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
