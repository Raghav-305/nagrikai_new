import { useState, useEffect, useCallback } from 'react';
import type { DocumentData } from '@types';
import { parseMarkdownHeadings, extractDocumentTitle } from '@utils/markdown';

interface UseDocumentationResult {
  documents: DocumentData[];
  isLoading: boolean;
  error: string | null;
  currentDoc: DocumentData | null;
  setCurrentDoc: (doc: DocumentData | null) => void;
  loadDocuments: () => Promise<void>;
  getDocumentByPath: (path: string) => DocumentData | undefined;
}

export const useDocumentation = (): UseDocumentationResult => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load all markdown files from the docs folder in the root
      const markdownFiles = import.meta.glob('/docs/*.md', { as: 'raw', eager: true });

      const docs: DocumentData[] = Object.entries(markdownFiles).map(([path, content]) => {
        const filename = path.split('/').pop() || '';
        const title = extractDocumentTitle(content);
        const headings = parseMarkdownHeadings(content);

        return {
          filename,
          path,
          title,
          content: content as string,
          headings,
          lastModified: new Date().toISOString(),
        };
      });

      setDocuments(docs);
      if (docs.length > 0) {
        setCurrentDoc(docs[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documentation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const getDocumentByPath = useCallback((path: string): DocumentData | undefined => {
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
