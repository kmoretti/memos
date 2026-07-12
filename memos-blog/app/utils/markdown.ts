import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

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

export function renderMarkdown(content: string): string {
  return md.render(content)
}
