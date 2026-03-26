import { useState, useCallback } from 'react';
import { apiClient } from '@utils/apiClient';
export const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchDepartments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.getDepartments();
            setDepartments(response.data || []);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch departments');
        }
        finally {
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
