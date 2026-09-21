import { FileCode } from 'lucide-react'
import { tokenizeLine } from '../lib/highlight'
import type { TokenKind } from '../lib/highlight'

interface CodeBlockProps {
  code: string
  filename: string
}

const tokenClasses: Record<TokenKind, string> = {
  plain: 'text-soft',
  comment: 'italic text-syntax-comment',
  string: 'text-syntax-string',
  keyword: 'text-syntax-keyword',
  property: 'text-fg',
  number: 'text-syntax-number',
  punct: 'text-muted',
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const lines = code.split('\n')

  return (
    <figure className="min-w-0 overflow-hidden rounded-lg border border-line bg-canvas">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 font-mono text-xs text-muted">
        <FileCode size={14} aria-hidden="true" />
        {filename}
      </figcaption>
      {/* Focusable so keyboard users can scroll it. */}
      <div
        role="region"
        aria-label={`${filename} source`}
        tabIndex={0}
        className="scroll-thin overflow-x-auto py-3 font-mono text-[13px] leading-6"
      >
        <pre className="w-max min-w-full">
          <code>
            {lines.map((line, index) => (
              <span key={index} className="flex px-3">
                <span aria-hidden="true" className="mr-4 w-5 shrink-0 select-none text-right text-faint">
                  {index + 1}
                </span>
                <span className="whitespace-pre">
                  {tokenizeLine(line).map((token, tokenIndex) => (
                    <span key={tokenIndex} className={tokenClasses[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  )
}
