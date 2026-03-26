import { useState, useCallback } from 'react';
import type { Complaint, ComplaintFilters } from '@types';
import { apiClient } from '@utils/apiClient';

interface UseComplaintsResult {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  fetchComplaints: (filters?: ComplaintFilters) => Promise<void>;
  createComplaint: (data: Omit<Complaint, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Complaint>;
  updateComplaint: (id: string, data: Partial<Complaint>) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;
}

export const useComplaints = (): UseComplaintsResult => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = useCallback(async (filters?: ComplaintFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getComplaints(filters);
      setComplaints(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createComplaint = useCallback(async (data: Omit<Complaint, '_id' | 'createdAt' | 'updatedAt'>): Promise<Complaint> => {
    try {
      const response = await apiClient.createComplaint(data);
      const newComplaint = response.data;
      setComplaints((prev) => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateComplaint = useCallback(async (id: string, data: Partial<Complaint>) => {
    try {
      await apiClient.updateComplaint(id, data);
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...data } : c))
      );
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteComplaint = useCallback(async (id: string) => {
    try {
      await apiClient.deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
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
