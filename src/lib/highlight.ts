export type TokenKind = 'plain' | 'comment' | 'string' | 'keyword' | 'property' | 'number' | 'punct'

export interface Token {
  kind: TokenKind
  text: string
}

// Groups: 1 comment, 2 string, 3 keyword, 4 object key, 5 number, 6 punctuation
const PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(const|let|export|return|true|false|null|type|interface)\b|\b([A-Za-z_$][\w$]*)(?=\s*:)|(\b\d+(?:\.\d+)?\b)|([{}[\](),:;=])/g

/** Tiny tokenizer, enough for the short TypeScript snippets on this site. */
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let last = 0

  for (const match of line.matchAll(PATTERN)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ kind: 'plain', text: line.slice(last, index) })

    const kind: TokenKind = match[1]
      ? 'comment'
      : match[2]
        ? 'string'
        : match[3]
          ? 'keyword'
          : match[4]
            ? 'property'
            : match[5]
              ? 'number'
              : 'punct'

    tokens.push({ kind, text: match[0] })
    last = index + match[0].length
  }

  if (last < line.length) tokens.push({ kind: 'plain', text: line.slice(last) })
  return tokens
}
