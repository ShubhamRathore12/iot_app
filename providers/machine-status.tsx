import React, { createContext, useContext } from 'react';
import { useMachineStatusFeed } from '@/hooks/use-machinestatus-feed';

type MachineStatusContextType = ReturnType<typeof useMachineStatusFeed>;

const MachineStatusContext = createContext<MachineStatusContextType | null>(null);

export function MachineStatusProvider({ children }: { children: React.ReactNode }) {
  const machineStatus = useMachineStatusFeed();

  return (
    <MachineStatusContext.Provider value={machineStatus}>
      {children}
    </MachineStatusContext.Provider>
  );
}

export function useMachineStatus() {
  const context = useContext(MachineStatusContext);
  if (!context) {
    throw new Error('useMachineStatus must be used within a MachineStatusProvider');
  }
  return context;
}
