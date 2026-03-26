import { useState, useCallback } from 'react';
import { apiClient } from '@utils/apiClient';
export const useComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchComplaints = useCallback(async (filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.getComplaints(filters);
            setComplaints(response.data || []);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const createComplaint = useCallback(async (data) => {
        try {
            const response = await apiClient.createComplaint(data);
            const newComplaint = response.data;
            setComplaints((prev) => [newComplaint, ...prev]);
            return newComplaint;
        }
        catch (err) {
            throw err;
        }
    }, []);
    const updateComplaint = useCallback(async (id, data) => {
        try {
            await apiClient.updateComplaint(id, data);
            setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, ...data } : c)));
        }
        catch (err) {
            throw err;
        }
    }, []);
    const deleteComplaint = useCallback(async (id) => {
        try {
            await apiClient.deleteComplaint(id);
            setComplaints((prev) => prev.filter((c) => c._id !== id));
        }
        catch (err) {
            throw err;
        }
    }, []);
    return {
        complaints,
        isLoading,
        error,
        fetchComplaints,
        createComplaint,
        updateComplaint,
        deleteComplaint,
    };
};
