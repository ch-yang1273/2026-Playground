import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { codeToHtml } from 'shiki';

/**
 * Converts markdown content to HTML
 * @param markdown - Raw markdown string
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return result.toString();
}

/**
 * Highlights code blocks using Shiki
 * @param code - Code string to highlight
 * @param lang - Programming language
 * @returns HTML string with syntax highlighting
 */
export async function highlightCode(code: string, lang: string = 'typescript'): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang,
      theme: 'github-dark',
    });
    return html;
  } catch (error) {
    console.error('Error highlighting code:', error);
    return `<pre><code>${code}</code></pre>`;
  }
}

/**
 * Process markdown content with code highlighting
 * @param markdown - Raw markdown string
 * @returns HTML string with highlighted code blocks
 */
export async function processMarkdown(markdown: string): Promise<string> {
  // First convert markdown to HTML
  let html = await markdownToHtml(markdown);

  // Find and highlight code blocks
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = [...html.matchAll(codeBlockRegex)];

  for (const match of matches) {
    const [fullMatch, lang, code] = match;
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');

    const highlightedCode = await highlightCode(decodedCode, lang);
    html = html.replace(fullMatch, highlightedCode);
  }

  return html;
}
