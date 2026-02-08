'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border bg-muted/50">
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{filename}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="flex items-center justify-end bg-muted/30 px-4 py-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  )
}
