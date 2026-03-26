import { useState, useEffect, useCallback } from 'react';
import { parseMarkdownHeadings, extractDocumentTitle } from '@utils/markdown';
export const useDocumentation = () => {
    const [documents, setDocuments] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Load all markdown files from the docs folder in the root
            const markdownFiles = import.meta.glob('/docs/*.md', { as: 'raw', eager: true });
            const docs = Object.entries(markdownFiles).map(([path, content]) => {
                const filename = path.split('/').pop() || '';
                const title = extractDocumentTitle(content);
                const headings = parseMarkdownHeadings(content);
                return {
                    filename,
                    path,
                    title,
                    content: content,
                    headings,
                    lastModified: new Date().toISOString(),
                };
            });
            setDocuments(docs);
            if (docs.length > 0) {
                setCurrentDoc(docs[0]);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load documentation');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);
    const getDocumentByPath = useCallback((path) => {
        return documents.find((doc) => doc.path === path);
    }, [documents]);
    return {
        documents,
        isLoading,
        error,
        currentDoc,
        setCurrentDoc,
        loadDocuments,
        getDocumentByPath,
    };
};
