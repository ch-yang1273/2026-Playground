import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full border-t border-purple-500/30 bg-gradient-to-br from-background via-purple-950/5 to-background overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none" />

      <div className="container relative z-10 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p
            className="text-center text-sm leading-loose md:text-left gradient-text-primary font-medium"
            style={{ fontFamily: 'Fira Code, monospace' }}
          >
            Built with Next.js, TypeScript, and Tailwind CSS. © {currentYear} DevBlog. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="relative text-sm font-medium transition-colors hover:text-purple-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Privacy
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/terms"
            className="relative text-sm font-medium transition-colors hover:text-cyan-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Terms
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/contact"
            className="relative text-sm font-medium transition-colors hover:text-blue-400 group"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Contact
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
