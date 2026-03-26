export const loadMarkdownFiles = async (): Promise<{ [key: string]: string }> => {
  const context = import.meta.glob('/docs/*.md', { as: 'raw', eager: true });
  return context as { [key: string]: string };
};

export const parseMarkdownHeadings = (content: string): Array<{ level: number; text: string; id: string }> => {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-');
      headings.push({ level, text, id });
    }
  });

  return headings;
};

export const extractDocumentTitle = (content: string): string => {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1];
    }
  }
  return 'Untitled';
};

export const getDocumentPath = (filename: string): string => {
  return `/docs/${filename}`;
};
