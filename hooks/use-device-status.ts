import { apiService } from '@/services/api';
import { useEffect, useState } from 'react';

export function useDeviceStatus() {
  const [deviceStatuses, setDeviceStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeviceStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const statuses = await apiService.getDeviceStatus();
      setDeviceStatuses(statuses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch device status');
      console.error('Error fetching device status:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    await fetchDeviceStatus();
  };

  useEffect(() => {
    fetchDeviceStatus();
    
    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchDeviceStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    deviceStatuses,
    loading,
    error,
    refreshStatus,
  };
}