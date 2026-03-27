import { apiService } from '@/services/api';
import { useState } from 'react';

interface UseDeviceReportsReturn {
  reports: any[];
  loading: boolean;
  error: string | null;
  fetchReports: (deviceName: string) => Promise<any[]>;
  clearReports: () => void;
}

export function useDeviceReports(): UseDeviceReportsReturn {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (deviceName: string) => {
    try {
      setLoading(true);
      setError(null);
      const data:any = await apiService.getDeviceReports(deviceName);
      const arrayData = Array.isArray(data?.data) ? data?.data : [];
      setReports(arrayData);``
      
      return arrayData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch device reports');
      console.error('Error fetching device reports:', err);
      setReports([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearReports = () => {
    setReports([]);
    setError(null);
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    clearReports,
  };
}