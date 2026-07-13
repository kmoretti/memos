import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

// Task list support
md.core.ruler.after('inline', 'task-lists', (state) => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'inline') continue
    const content = tokens[i].content
    if (/^\[[ x]\]\s/.test(content)) {
      const checked = content[1] === 'x'
      const text = content.slice(4)
      tokens[i].content = text
      tokens[i].children = [
        Object.assign(new state.Token('html_inline', '', 0), {
          content: `<input type="checkbox" disabled ${checked ? 'checked' : ''}> `,
        }),
        ...md.utils.arrayReplaceAt(tokens[i].children!, 0, md.parseInline(text, state.env)[0].children!),
      ]
    }
  }
})

// Hashtag support: replace #tag with <span class="hashtag">#tag</span>
// in rendered HTML output using string replacement.
export function renderMarkdown(content: string): string {
  // Replace #tag patterns BEFORE markdown rendering.
  // Use HTAG<N>HTAG as placeholder (no underscores to avoid emphasis parsing).
  const HASHTAG_RE = /(^|\s)#([\u4e00-\u9fa5a-zA-Z0-9_]+)/g
  let counter = 0
  const placeholders: string[] = []

  const safe = content.replace(HASHTAG_RE, (match, prefix, tag) => {
    const idx = counter++
    placeholders.push(tag)
    return prefix + `HTAG${idx}HTAG`
  })

  const html = md.render(safe)

  // Replace HTAG<N>HTAG placeholders with styled hashtag spans
  return html.replace(/HTAG(\d+)HTAG/g, (_, idx) => {
    return `<span class="hashtag">#${placeholders[Number(idx)]}</span>`
  })
}
