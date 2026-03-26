import { useState, useCallback } from 'react';
import type { Department } from '@types';
import { apiClient } from '@utils/apiClient';

interface UseDepartmentsResult {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
}

export const useDepartments = (): UseDepartmentsResult => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    departments,
    isLoading,
    error,
    fetchDepartments,
  };
};
