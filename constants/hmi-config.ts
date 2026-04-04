/**
 * Centralized HMI configuration for all machines.
 * Used by auto, auto-grain, auto-paddy, and other HMI screens.
 */

// ─── Machine HMI Sensor/Control Definitions ─────────────────────────────────

export interface SensorConfig {
  key: string;
  label: string;
}

export interface MachineHMIConfig {
  serialNumber: string;
  temperatureSensors: Record<string, SensorConfig>;
  controls: Record<string, SensorConfig>;
  compressor: {
    time: string;
    hp: string;
    lp: string;
  };
  hasCRValves?: boolean;
}

// ─── Shared Building Blocks ──────────────────────────────────────────────────

// AP machines (grain/paddy)
const AP_TEMP_SENSORS: Record<string, SensorConfig> = {
  T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
  T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
  T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
};

const AP_CONTROLS: Record<string, SensorConfig> = {
  AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
  HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
  BLOWER: { key: "Blower_speed", label: "Blower" },
};

// Some machines use "AHT_vale_speed" (typo in backend)
const AP_CONTROLS_TYPO: Record<string, SensorConfig> = {
  ...AP_CONTROLS,
  AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
};

const DEFAULT_COMPRESSOR = {
  time: "Compressor_timer",
  hp: "HP_value",
  lp: "LP_value",
};

// S7-200 machines
const S7_200_TEMP_SENSORS: Record<string, SensorConfig> = {
  TH: { key: "AFTER_HEATER_TEMP_Th", label: "Supply Air(TH)" },
  T0: { key: "AIR_OUTLET_TEMP", label: "After Heat(T0)" },
  T1: { key: "COLD_AIR_TEMP_T1", label: "Cold Air(T1)" },
  T2: { key: "AMBIENT_AIR_TEMP_T2", label: "Ambient(T2)" },
};

const S7_200_CONTROLS: Record<string, SensorConfig> = {
  HTR: { key: "AFTER_HEAT_VALVE_RPM", label: "Heater" },
  AHT: { key: "AFTER_HEAT_VALVE_RPM", label: "After Heat(AHT)" },
  HGS: { key: "HOT_GAS_VALVE_RPM", label: "Hot Gas(HGS)" },
  BLOWER: { key: "BLOWER_RPM", label: "Blower" },
  COND: { key: "CONDENSER_RPM", label: "Condenser" },
};

const S7_200_COMPRESSOR = {
  time: "COMPRESSOR_TIME",
  hp: "HP",
  lp: "LP",
};

// E-series S7-1200 machines (115, 116, 117, 119, 120, 30)
const E_SERIES_TEMP_SENSORS: Record<string, SensorConfig> = {
  T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
  T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
  T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
  TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
};

const E_SERIES_CONTROLS: Record<string, SensorConfig> = {
  AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
  HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
  BLOWER: { key: "Blower_speed", label: "Blower" },
};

// ─── Per-Machine HMI Configs ─────────────────────────────────────────────────

export const MACHINE_HMI_CONFIG: Record<string, MachineHMIConfig> = {
  // ── AP (Grain/Paddy) Machines ──────────────────────────────────────────
  "GTPL-132-300-AP-S7-1200": {
    serialNumber: "GTPL_132",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-136-gT-450AP": {
    serialNumber: "GTPL_136",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-139-GT-300AP-S7-1200": {
    serialNumber: "GTPL_139",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: { ...AP_CONTROLS_TYPO, COND: { key: "Condenser_fan_speed", label: "Condenser Fan" } },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-142-gT-450AP-S7-1200": {
    serialNumber: "GTPL_142",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: AP_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-143-gT-450AP-S7-1200": {
    serialNumber: "GTPL_143",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: AP_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-123-GT-450AP": {
    serialNumber: "GTPL_123",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: AP_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },

  // ── S7-1200 T-series (large tonnage) ───────────────────────────────────
  "GTPL-122-gT-1000T-S7-1200": {
    serialNumber: "GTPL_122_S7_1200",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-121-gT-1000T-S7-1200": {
    serialNumber: "GTPL_121",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-124-GT-450T-S7-1200": {
    serialNumber: "GTPL_124",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-133-GT-650T-S7-1200": {
    serialNumber: "GTPL_133",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-131-GT-650T-S7-1200": {
    serialNumber: "GTPL_131",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-137-GT-450T-S7-1200": {
    serialNumber: "GTPL_137",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
      COND: { key: "Cond_fan_speed", label: "Condenser Fan" },
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-138-GT-450T-S7-1200": {
    serialNumber: "GTPL_138",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
      COND: { key: "Cond_fan_speed", label: "Condenser Fan" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-145-GT-450T-S7-1200": {
    serialNumber: "GTPL_145",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-148-GT-450T-S7-1200": {
    serialNumber: "GTPL_148",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-134-gT-450T-S7-1200": {
    serialNumber: "GTPL_134",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-135-gT-450T-S7-1200": {
    serialNumber: "GTPL_135",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-061-gT-450T-S7-1200": {
    serialNumber: "GTPL_061",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: {
      AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
      HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
      BLOWER: { key: "Blower_speed", label: "Blower" },
    },
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },

  // ── E-series S7-1200 (with heater + TH sensor) ────────────────────────
  "GTPL-30-gT-180E-S7-1200": {
    serialNumber: "GTPL_114",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },
  "GTPL-115-gT-180E-S7-1200": {
    serialNumber: "GTPL_115",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },
  "GTPL-116-gT-240E-S7-1200": {
    serialNumber: "GTPL_116",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },
  "GTPL-117-gT-320E-S7-1200": {
    serialNumber: "GTPL_117",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },
  "GTPL-119-gT-180E-S7-1200": {
    serialNumber: "GTPL_119",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },
  "GTPL-120-gT-180E-S7-1200": {
    serialNumber: "GTPL_120",
    temperatureSensors: E_SERIES_TEMP_SENSORS,
    controls: E_SERIES_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
  },

  // ── S7-200 Machines ────────────────────────────────────────────────────
  "GTPL-118-gT-60T-S7-200": {
    serialNumber: "GTPL_118",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: S7_200_CONTROLS,
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-108-gT-40E-P-S7-200": {
    serialNumber: "GTPL_108",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-109-gT-40E-P-S7-200": {
    serialNumber: "GTPL_109",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-110-gT-40E-P-S7-200": {
    serialNumber: "GTPL_110",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-111-gT-80E-P-S7-200": {
    serialNumber: "GTPL_111",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-112-gT-80E-P-S7-200": {
    serialNumber: "GTPL_112",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },
  "GTPL-113-gT-80E-P-S7-200": {
    serialNumber: "GTPL_113",
    temperatureSensors: S7_200_TEMP_SENSORS,
    controls: { ...S7_200_CONTROLS, COND: { key: "Fan_speed", label: "Condenser Fan" } },
    compressor: S7_200_COMPRESSOR,
  },

  // ── Special / Legacy ───────────────────────────────────────────────────
  "Gtpl-S7-1200-02": {
    serialNumber: "GTOL-1023",
    temperatureSensors: {
      TH: { key: "AI_TH_Act", label: "Supply Air" },
      T0: { key: "AI_AIR_OUTLET_TEMP", label: "After Heat" },
      T1: { key: "AI_COLD_AIR_TEMP", label: "Cold Air" },
      T2: { key: "AI_AMBIANT_TEMP", label: "Ambient" },
    },
    controls: {
      HTR: { key: "Value_to_Display_HEATER", label: "Heater" },
      AHT: { key: "Value_to_Display_AHT_VALE_OPEN", label: "After Heat" },
      HGS: { key: "Value_to_Display_HOT_GAS_VALVE_OPEN", label: "Hot Gas" },
      BLOWER: { key: "Value_to_Display_EVAP_ACT_SPEED", label: "Blower" },
      COND: { key: "Value_to_Display_COND_ACT_SPEED", label: "Condenser" },
    },
    compressor: {
      time: "COMPRESSOR_TIME",
      hp: "AI_COND_PRESSURE",
      lp: "AI_SUC_PRESSURE",
    },
  },
};

// Fallback config for unknown devices
export const DEFAULT_HMI_CONFIG: MachineHMIConfig = {
  serialNumber: "UNKNOWN",
  temperatureSensors: AP_TEMP_SENSORS,
  controls: {
    AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
    HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
    BLOWER: { key: "Blower_speed", label: "Blower" },
  },
  compressor: DEFAULT_COMPRESSOR,
  hasCRValves: false,
};

export function getHMIConfig(device: string): MachineHMIConfig {
  return MACHINE_HMI_CONFIG[device] || DEFAULT_HMI_CONFIG;
}

// ─── Grain Chilling Machine Configs ─────────────────────────────────────────

// Grain mode controls - all AP machines show condenser fan
const GRAIN_AP_CONTROLS: Record<string, SensorConfig> = {
  AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
  HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
  BLOWER: { key: "Blower_speed", label: "Blower" },
  CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" },
};

const GRAIN_AP_CONTROLS_TYPO: Record<string, SensorConfig> = {
  ...GRAIN_AP_CONTROLS,
  AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
};

export const GRAIN_MACHINE_HMI_CONFIG: Record<string, MachineHMIConfig> = {
  "GTPL-132-300-AP-S7-1200": {
    serialNumber: "GTPL_132_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-136-gT-450AP": {
    serialNumber: "GTPL_136_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-139-GT-300AP-S7-1200": {
    serialNumber: "GTPL_139_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-142-gT-450AP-S7-1200": {
    serialNumber: "GTPL_142_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-123-GT-450AP": {
    serialNumber: "GTPL_123_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-143-gT-450AP-S7-1200": {
    serialNumber: "GTPL_143_GRAIN",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
};

export function getGrainHMIConfig(device: string): MachineHMIConfig {
  return GRAIN_MACHINE_HMI_CONFIG[device] || MACHINE_HMI_CONFIG[device] || DEFAULT_HMI_CONFIG;
}

// ─── Paddy Ageing Machine Configs ───────────────────────────────────────────

export const PADDY_MACHINE_HMI_CONFIG: Record<string, MachineHMIConfig> = {
  "GTPL-132-300-AP-S7-1200": {
    serialNumber: "GTPL_132_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-136-gT-450AP": {
    serialNumber: "GTPL_136_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-139-GT-300AP-S7-1200": {
    serialNumber: "GTPL_139_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-142-gT-450AP-S7-1200": {
    serialNumber: "GTPL_142_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-123-GT-450AP": {
    serialNumber: "GTPL_123_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
  "GTPL-143-gT-450AP-S7-1200": {
    serialNumber: "GTPL_143_PADDY",
    temperatureSensors: AP_TEMP_SENSORS,
    controls: GRAIN_AP_CONTROLS_TYPO,
    compressor: DEFAULT_COMPRESSOR,
    hasCRValves: true,
  },
};

export function getPaddyHMIConfig(device: string): MachineHMIConfig {
  return PADDY_MACHINE_HMI_CONFIG[device] || MACHINE_HMI_CONFIG[device] || DEFAULT_HMI_CONFIG;
}

// ─── Device Classification Lists ─────────────────────────────────────────────

export const GRAIN_PADDY_DEVICES = [
  "GTPL-132-300-AP-S7-1200",
  "GTPL-136-gT-450AP",
  "GTPL-139-GT-300AP-S7-1200",
  "GTPL-142-gT-450AP-S7-1200",
  "GTPL-143-gT-450AP-S7-1200",
  "GTPL-123-GT-450AP",
];

export const SPECIAL_MACHINES = [
  "GTPL-061-gT-450T-S7-1200",
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-122-gT-1000T-S7-1200",
  ...GRAIN_PADDY_DEVICES,
  "GTPL-124-GT-450T-S7-1200",
  "GTPL-133-GT-650T-S7-1200",
  "GTPL-131-GT-650T-S7-1200",
];

// Auto screen special machines (T-series + 061)
export const AUTO_SPECIAL_MACHINES = [
  "GTPL-137-GT-450T-S7-1200",
  "GTPL-138-GT-450T-S7-1200",
  "GTPL-145-GT-450T-S7-1200",
  "GTPL-148-GT-450T-S7-1200",
  "GTPL-134-gT-450T-S7-1200",
  "GTPL-135-gT-450T-S7-1200",
  "GTPL-061-gT-450T-S7-1200",
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-122-gT-1000T-S7-1200",
  "GTPL-124-GT-450T-S7-1200",
  "GTPL-133-GT-650T-S7-1200",
  "GTPL-131-GT-650T-S7-1200",
];

export const CR_VALVE_DEVICES = [
  "GTPL-132-300-AP-S7-1200",
  "GTPL-136-gT-450AP",
  "GTPL-139-GT-300AP-S7-1200",
  "GTPL-143-gT-450AP-S7-1200",
  "GTPL-142-gT-450AP-S7-1200",
  "GTPL-123-GT-450AP",
];

// Extended CR valve list for auto screen (includes T-series)
export const AUTO_CR_VALVE_DEVICES = [
  ...CR_VALVE_DEVICES,
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-122-gT-1000T-S7-1200",
  "GTPL-124-GT-450T-S7-1200",
  "GTPL-133-GT-650T-S7-1200",
  "GTPL-131-GT-650T-S7-1200",
  "GTPL-134-gT-450T-S7-1200",
  "GTPL-135-gT-450T-S7-1200",
  "GTPL-137-GT-450T-S7-1200",
  "GTPL-138-GT-450T-S7-1200",
  "GTPL-145-GT-450T-S7-1200",
  "GTPL-148-GT-450T-S7-1200",
  "GTPL-061-gT-450T-S7-1200",
];

export const S7_200_MACHINES = [
  "GTPL-118-gT-60T-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
];

// Devices with special heater handling (shown after LP in compressor section)
export const HEATER_DEVICES = [
  "GTPL-120-gT-180E-S7-1200",
  "GTPL-116-gT-240E-S7-1200",
  "GTPL-115-gT-180E-S7-1200",
  "GTPL-30-gT-180E-S7-1200",
  "GTPL-117-gT-320E-S7-1200",
  "GTPL-119-gT-180E-S7-1200",
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-145-GT-450T-S7-1200",
  "GTPL-148-GT-450T-S7-1200",
];

// Devices with bar pressure units (instead of psi)
export const BAR_PRESSURE_DEVICES = [
  "GTPL-137-GT-450T-S7-1200",
  "GTPL-138-GT-450T-S7-1200",
  "GTPL-145-GT-450T-S7-1200",
  "GTPL-148-GT-450T-S7-1200",
];

// ─── CR Valve Definitions ────────────────────────────────────────────────────

export const CR_VALVES = [
  { key: "cr-valve-25", label: "CR Valve 25%", dataKey: "CR_valve_25_percent_on_Q0_2", fallbackKeys: ["CR_valve_25_percent_ON_Q0_2", "CR_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"] },
  { key: "cr-valve-50", label: "CR Valve 50%", dataKey: "CR_valve_50_percent_on_Q0_3", fallbackKeys: ["CR_valve_50_percent_ON_Q0_3", "CR_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"] },
  { key: "cr-valve-75", label: "CR Valve 75%", dataKey: "CR_valve_75_percent_on_Q2_2", fallbackKeys: ["CR_valve_75_percent_ON_Q2_2", "CR_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"] },
  { key: "cr-valve-100", label: "CR Valve 100%", dataKey: "CR_valve_100_percent_on_Q2_5", fallbackKeys: ["CR_valve_100_percent_ON_Q2_7", "CR_valve_100_percent_on_Q2_7", "CR_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7"] },
];

// Auto screen uses uppercase ON in data keys
export const AUTO_CR_VALVES = [
  { key: "cr-valve-25", label: "CR Valve 25%", dataKey: "CR_valve_25_percent_ON_Q0_2", fallbackKeys: ["CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"] },
  { key: "cr-valve-50", label: "CR Valve 50%", dataKey: "CR_valve_50_percent_ON_Q0_3", fallbackKeys: ["CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"] },
  { key: "cr-valve-75", label: "CR Valve 75%", dataKey: "CR_valve_75_percent_ON_Q2_2", fallbackKeys: ["CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"] },
  { key: "cr-valve-100", label: "CR Valve 100%", dataKey: "CR_valve_100_percent_ON_Q2_7", fallbackKeys: ["CR_valve_100_percent_on_Q2_7", "CR_valve_100_percent_on_Q2_5", "CR_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7"] },
];

// Resolve CR valve value with fallback keys (handles different naming conventions per machine)
export function resolveCRValue(data: Record<string, any> | undefined, valve: { dataKey: string; fallbackKeys: string[] }): string | undefined {
  if (!data) return undefined;
  if (data[valve.dataKey] !== undefined) return String(data[valve.dataKey]);
  for (const k of valve.fallbackKeys) {
    if (data[k] !== undefined) return String(data[k]);
  }
  return undefined;
}

// ─── Color Tokens ────────────────────────────────────────────────────────────

export const HMI_COLORS = {
  temperature: {
    T0: "#ef4444",
    T1: "#3b82f6",
    T2: "#10b981",
    TH: "#ec4899",
    DEFAULT: "#6b7280",
  },
  controls: {
    AHT: "#8b5cf6",
    HGS: "#ec4899",
    BLOWER: "#f59e0b",
    CONDENSORFANSPEED: "#06b6d4",
    HTR: "#10b981",
    COND: "#f97316",
    DEFAULT: "#f97316",
  },
  compressor: {
    hp: "#f43f5e",
    lp: "#6366f1",
    DEFAULT: "#3b82f6",
  },
  crValve: "#8b5cf6",
  statusOn: "#10b981",
  statusOff: "#ef4444",
  statusOnline: "#f59e0b",
} as const;

export function getSetPointColor(temp: any): string {
  const v = parseFloat(temp);
  if (isNaN(v)) return "#64748b";
  if (v < 20) return "#3b82f6";
  if (v < 30) return "#10b981";
  if (v < 40) return "#f59e0b";
  return "#ef4444";
}

export function getTempColor(sensorKey: string): string {
  return HMI_COLORS.temperature[sensorKey as keyof typeof HMI_COLORS.temperature] || HMI_COLORS.temperature.DEFAULT;
}

export function getControlColor(controlKey: string): string {
  return HMI_COLORS.controls[controlKey as keyof typeof HMI_COLORS.controls] || HMI_COLORS.controls.DEFAULT;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatHeaterValue(value: any, device: string): string {
  if (S7_200_MACHINES.includes(device)) {
    return !value || value === 0 || value === '0' ? 'OFF' : 'ON';
  }
  return String(value ?? '--');
}
