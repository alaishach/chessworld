import { marked } from 'marked';

// Configure once at module load — GFM enables tables, strikethrough, etc.
marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}
