import { useCallback, useEffect, useRef, useState } from "react";

type MessageLog = {
  message: string;
  type: "info" | "error" | "warning" | "status";
  timestamp: string;
};

type MachineDataEntry = {
  machineName: string;
  lastUpdate: string;
  recordId: number;
  hasNewData: boolean;
  machineStatus: boolean;
  coolingStatus: boolean;
  internetStatus: boolean;
};

type MachineStatus = {
  overallMachineStatus: boolean;
  overallCoolingStatus: boolean;
  overallInternetStatus: boolean;
  lastUpdate: Record<string, string>;
  recordIds: Record<string, number>;
  dataChanged: Record<string, boolean>;
  machines: MachineDataEntry[];
};

export const useMachineStatusFeed = () => {
  const [status, setStatus] = useState<MachineStatus>({
    overallMachineStatus: false,
    overallCoolingStatus: false,
    overallInternetStatus: false,
    lastUpdate: {},
    recordIds: {},
    dataChanged: {},
    machines: [],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  const addMessage = useCallback((msg: string, type: MessageLog["type"]) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [
      ...prev.slice(-9),
      { message: msg, type, timestamp },
    ]);
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setError(null);
      const response = await fetch("https://grain-backend-1.onrender.com/api/status-public");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: any = await response.json();

      let machinesData;
      if (Array.isArray(result)) {
        machinesData = result;
      } else if (result && typeof result === 'object' && Array.isArray(result.data)) {
        machinesData = result.data;
      } else if (result && typeof result === 'object' && result.success && Array.isArray(result.data)) {
        machinesData = result.data;
      } else {
        addMessage("Invalid machine data format from API", "error");
        if (isMounted.current) setIsConnected(false);
        return;
      }

      if (!Array.isArray(machinesData) || machinesData.length === 0) {
        addMessage("No machine data available", "warning");
        if (isMounted.current) setIsConnected(false);
        return;
      }

      const machines: MachineDataEntry[] = machinesData.map(
        (machine: any, index: number) => ({
          machineName: machine.machineName || `Machine ${index + 1}`,
          lastUpdate: machine.lastUpdate || new Date().toISOString(),
          recordId: machine.recordId || 0,
          hasNewData: machine.hasNewData || false,
          machineStatus: Boolean(machine.machineStatus),
          coolingStatus: Boolean(machine.coolingStatus),
          internetStatus: Boolean(machine.internetStatus),
        })
      );

      const lastUpdate: Record<string, string> = {};
      const recordIds: Record<string, number> = {};
      const dataChanged: Record<string, boolean> = {};

      let allOnline = true;
      let allCooling = true;
      let allInternet = true;

      machines.forEach((m) => {
        lastUpdate[m.machineName] = m.lastUpdate;
        recordIds[m.machineName] = m.recordId;
        dataChanged[m.machineName] = m.hasNewData;

        allOnline = allOnline && m.machineStatus;
        allCooling = allCooling && m.coolingStatus;
        allInternet = allInternet && m.internetStatus;
      });

      if (isMounted.current) {
        setStatus({
          overallMachineStatus: allOnline,
          overallCoolingStatus: allCooling,
          overallInternetStatus: allInternet,
          lastUpdate,
          recordIds,
          dataChanged,
          machines,
        });

        setIsConnected(true);
        addMessage("Machine data updated", "status");
      }
    } catch (err: any) {
      const errorMsg = `Error fetching machine data: ${err.message}`;
      addMessage(errorMsg, "error");
      if (isMounted.current) {
        setIsConnected(false);
        setError(errorMsg);
      }
    }
  }, [addMessage]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    fetchData();
    intervalRef.current = setInterval(fetchData, 18 * 1000);
    addMessage("Polling started (18 second interval)", "info");
  }, [fetchData, addMessage]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsConnected(false);
      addMessage("Polling stopped", "warning");
    }
  }, [addMessage]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    isMounted.current = true;
    startPolling();

    return () => {
      isMounted.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startPolling]);

  return {
    status,
    isConnected,
    messages,
    stopPolling,
    startPolling,
    refresh,
    error,
  };
};
