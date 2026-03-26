export const loadMarkdownFiles = async () => {
    const context = import.meta.glob('/docs/*.md', { as: 'raw', eager: true });
    return context;
};
export const parseMarkdownHeadings = (content) => {
    const headings = [];
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
export const extractDocumentTitle = (content) => {
    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.match(/^#\s+(.+)$/);
        if (match) {
            return match[1];
        }
    }
    return 'Untitled';
};
export const getDocumentPath = (filename) => {
    return `/docs/${filename}`;
};
