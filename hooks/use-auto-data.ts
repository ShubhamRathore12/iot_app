import { apiRequest } from "@/lib/api";
import { AUTO_TYPE_TO_TABLE_MAP, DEVICE_NAME_TO_STATUS_KEY } from "@/constants/machine-config";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMachineStatus } from "@/providers/machine-status";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  const { status } = useMachineStatus();

  const [data, setData] = useState<AutoData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusRef = useRef(status);

  // Keep statusRef current without triggering effect re-runs
  statusRef.current = status;

  const fetchData = useCallback(async () => {
    if (!autoType) return;

    const table = AUTO_TYPE_TO_TABLE_MAP[autoType];
    const statusKey = DEVICE_NAME_TO_STATUS_KEY[autoType];

    // Use ref to avoid stale closure + unnecessary re-renders
    const deviceStatus = statusRef.current.machines?.find(
      (m: any) => m.machineName === statusKey
    );

    const isMachineRunning = deviceStatus?.machineStatus ?? false;

    if (!isMachineRunning) {
      setData(null);
      setIsConnected(false);
      setError(null);
      setRetryCount(0);
      return;
    }

    if (!table) {
      setError("Unknown table mapping for device: " + autoType);
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiRequest(
        `/api/table?table=${encodeURIComponent(table)}`
      );

      if (result?.data) {
        setData(result.data);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error("Invalid response structure - no data property");
      }
    } catch (err: any) {
      setIsConnected(false);
      setError(`Failed to fetch data: ${err.message}`);
      setRetryCount((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [autoType]);

  useEffect(() => {
    if (!autoType) return;

    fetchData();
    intervalRef.current = setInterval(fetchData, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoType, fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const formatValue = useCallback((value: any, unit: string = "") => {
    if (value === undefined || value === null || value === '--') return "--";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${value}${unit}`;

    if (numericValue === 0) {
      if (unit.includes("°")) return `0.00${unit}`;
      if (unit.includes("bar")) return `${numericValue.toFixed(1)}${unit}`;
      return `0${unit}`;
    }

    if (unit.includes("°")) return `${numericValue.toFixed(1)}${unit}`;
    if (unit.includes("bar")) return `${numericValue.toFixed(1)}${unit}`;

    const decimalPart = numericValue % 1;
    const roundedValue =
      decimalPart >= 0.5 ? Math.ceil(numericValue) : Math.floor(numericValue);
    return `${roundedValue}${unit}`;
  }, []);

  return {
    data: data || {},
    isConnected,
    error,
    retryCount,
    isLoading,
    formatValue,
    refreshData,
    clearError: () => setError(null),
  };
};
