import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function InputsScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();
    const [mounted, setMounted] = useState(false);

    const isGTPL118 = device === "GTPL-118-gT-60T-S7-200";
    const isGT80E = !isGTPL118 && ['108', '109', '110', '111', '112', '113'].some(code => device?.includes(code));
    const isGtpl122 = ['122', '121', '133', '131'].some(code => device?.includes(code));
    const isGtpl1200_02 = device === "Gtpl-S7-1200-02";
    const isGtpl115 = device === "GTPL-115-gT-180E-S7-1200" || device === "GTPL-30-gT-180E-S7-1200" || device === 'GTPL-119-gT-180E-S7-1200' || device === "GTPL-120-gT-180E-S7-1200";
    const isGtpl124 = device === "GTPL-124-GT-450T-S7-1200";
    const isGTPL116 = device === "GTPL-116-gT-240E-S7-1200" || device === "GTPL-117-gT-320E-S7-1200";
    const isGTPL132 = device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-GT-450AP" || device === "GTPL-143-gT-450AP-S7-1200";
    const isGTPL136 = device === "GTPL-136-gT-450AP";
    const isGTPL137 = device === "GTPL-137-GT-450T-S7-1200";
    const isGTPL138 = device === "GTPL-138-GT-450T-S7-1200";
    const isGTPL134_135 = device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device === "GTPL-145-GT-450T-S7-1200" || device === "GTPL-148-GT-450T-S7-1200";
    const isGTPL061 = device === "GTPL-061-gT-450T-S7-1200";
    const isGTPL139 = device === "GTPL-139-GT-300AP-S7-1200";
    const isGTPL144 = device === "GTPL-144-GT-300AP-S7-1200";

    const { data } = useAutoData(device as string);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to normalize all possible "fault" values
    const isStatusFault = (value: unknown): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            return lowerValue === "true" || lowerValue === "tr";
        }
        return false;
    };

    const gtpl_118_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor overheat", status: data?.Compressor_overheat_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_3 },
        { id: "I0.4", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_4 },
        { id: "I0.5", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_5 },
        { id: "I0.6", description: "Condenser fan TOP fault", status: data?.Condenser_fan_TOP_fault_I0_6 },
        { id: "I0.7", description: "Condenser fan circuit breaker", status: data?.Condenser_fan_circuit_breaker_I0_7 },
        { id: "I1.0", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_0 },
        { id: "I1.1", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_1 },
        { id: "I1.2", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I1_2 },
        { id: "I1.3", description: "Condenser fan door open", status: data?.Condenser_fan_door_open_I1_3 },
    ];

    const s7_200_faultStatus = [
        { id: "1", description: "Blower circuit breaker fault", status: data?.BLOWER_CIRCUIT_BREAKER_FAULT },
        { id: "2", description: "Blower drive fault", status: data?.BLOWER_DRIVE_FAULT },
        { id: "3", description: "Blower drive operation", status: data?.BLOWER_DRIVE_ON },
        { id: "4", description: "Spare", status: data?.AFTER_HEAT_TEMP_MORE_THAN_50 },
        { id: "5", description: "Condenser fan overheat", status: data?.COND_FAN_MOTOR_OVERHEAT },
        { id: "6", description: "Spare", status: data?.SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE },
        { id: "7", description: "Compressor circuit breaker fault", status: data?.COMPRESSOR_CIRCUIT_BREA_FAULT },
        { id: "8", description: "Low pressure fault", status: data?.LOW_PRESSURE_FAULT },
        { id: "9", description: "High pressure fault", status: data?.HIGH_PRESSURE_FAULT },
        { id: "10", description: "Three phase monitor fault", status: data?.THREE_PHASE_MONITORING_FAULT },
        { id: "11", description: "Heater overheat", status: data?.HEATER_OVER_HEAT },
        { id: "12", description: "Condenser fan circuit breaker fault", status: data?.COND_FAN_CIRCUIT_BREAKE_FAULT },
        { id: "13", description: "Heater circuit breaker fault", status: data?.HEATER_CIRCUIT_BREAKER_FAULT },
        { id: "14", description: "Heater RCCB fault", status: data?.HEATER_RCCCB_TRIP_FAULT },
        { id: "15", description: "Condenser fan door open", status: data?.CONDENSER_FAN_DOOR_OPEN },
    ];

    const s7_1200_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_ },
        { id: "I0.1", description: "Compressor module FDK error", status: data?.Comp_module_fdk_error_ },
        { id: "I0.2", description: "Compressor in operation", status: data?.Comp_in_operation_ },
        { id: "I0.3", description: "Oil level", status: data?.Oil_level_ },
        { id: "I0.4", description: "Blower drive", status: data?.Blower_drive_ },
        { id: "I0.5", description: "Blower in operation", status: data?.Blower_in_operation_ },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_ },
        { id: "I0.7", description: "Condenser fan 1 TOP", status: data?.Cond_fan_1_TOP_ },
        { id: "I1.0", description: "Cond fan 1 circuit breaker", status: data?.Cond_fan_1_cir_cuit_breaker_ },
        { id: "I1.1", description: "Low pressure fault", status: data?.Low_pressure_fault_ },
        { id: "I1.2", description: "Compressor OLR trip", status: data?.Compressor_OLR_trip_ },
        { id: "I1.3", description: "High pressure fault", status: data?.High_pressure_fault_ },
        { id: "I1.4", description: "Start stop switch", status: data?.Start_stop_switch_ },
        { id: "I2.0", description: "Three phase monitoring fault", status: data?.Three_phase_monitoring_fault_ },
        { id: "I2.2", description: "Condenser fan 2 TOP", status: data?.Cond_fan_2_TOP_ },
        { id: "I2.3", description: "Condenser fan 3 TOP", status: data?.Cond_fan_3_TOP_ },
        { id: "I2.4", description: "Condenser fan 4 TOP", status: data?.Cond_fan_4_TOP_ },
        { id: "I2.5", description: "Cond fan 2 circuit breaker", status: data?.Cond_fan_2_circuit_breaker_ },
        { id: "I2.6", description: "Cond fan 3 circuit breaker", status: data?.Cond_fan_3_circuit_breaker_ },
        { id: "I2.7", description: "Cond fan 4 circuit breaker", status: data?.Cond_fan_4_circuit_breaker_ },
        { id: "I3.0", description: "Condenser fan 5 TOP", status: data?.Cond_fan_5_TOP_ },
        { id: "I3.1", description: "Condenser fan 6 TOP", status: data?.Cond_fan_6_TOP_ },
        { id: "I3.2", description: "Cond fan 5 circuit breaker", status: data?.Cond_fan_5_circuit_breaker_ },
        { id: "I3.3", description: "Cond fan 6 circuit breaker", status: data?.Cond_fan_6_circuit_breaker_ },
    ];

    const gtpl_132_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.["Compressor_circuit_breaker_I0_0"] },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.["Compressor_module_feedback_error_I0_1"] },
        { id: "I0.2", description: "Compressor in operation", status: data?.["Compressor_in_operation_I0_2"] },
        { id: "I0.3", description: "Compressor oil low", status: data?.["Compressor_oil_low_I0_3"] },
        { id: "I0.4", description: "Blower drive fault", status: data?.["Blower_drive_fault_I0_4"] },
        { id: "I0.5", description: "Blower drive in operation", status: data?.["Blower_drive_in_operation_I0_5"] },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.["Blower_circuit_breaker_I0_6"] },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.["Condenser_fan1_TOP_fault_I0_7"] },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.["Condenser_fan1_circuit_breaker_I1_0"] },
        { id: "I1.1", description: "Spare", status: data?.["Spare_I1_1"] },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.["High_Pressure_Fault_I1_3"] },
        { id: "I1.4", description: "Start/stop", status: data?.["Start/stop_I1_4"] },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.["Three_phase_monitor_fault_I2_0"] },
        { id: "I2.1", description: "Spare", status: data?.["Spare_I2_1"] },
        { id: "I2.2", description: "Condenser fan2 TOP fault", status: data?.["Cond_fan2_TOP_fault_I2_2"] },
        { id: "I2.3", description: "Spare", status: data?.["Spare_I2_3"] },
        { id: "I2.4", description: "Spare", status: data?.["Spare_I2_4"] },
        { id: "I2.5", description: "Condenser fan2 circuit breaker fault", status: data?.["Condenser_fan2_circuit_breaker_fault_I2_5"] },
    ];

    const gtpl_134_135_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
        { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_6 },
        { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_7 },
    ];

    const gtpl_137_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
        { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_6 },
        { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_7 },
    ];

    const gtpl_138_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
        { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_6 },
        { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_7 },
    ];

    const gtpl_136_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond__fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond__fan3_TOP_fault_I2_3 },
        { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond__fan4_TOP_fault_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond__fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond__fan3_circuit_breaker_fault_I2_6 },
        { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond__fan4_circuit_breaker_fault_I2_7 },
    ];

    const gtpl_115_faultStatus = [
        { id: "1", description: "Blower circuit breaker fault", status: data?.BLOWER_CIRCUIT_BREAKER_I0_0 },
        { id: "2", description: "Blower drive fault", status: data?.BLOWER_DRIVE_I0_1 },
        { id: "3", description: "Blower in operation", status: data?.BLOWER_IN_OPERATION_I0_2 },
        { id: "4", description: "Heater drive fault", status: data?.HEATER_DRIVE_FAULT_I0_4 },
        { id: "5", description: "Condenser fan TOP fault", status: data?.CONDENSER_FAN_TOP_FAULT_I0_6 },
        { id: "6", description: "Condenser fan drive fault", status: data?.CONDENSER_FAN_DRIVE_FAULT_I0_7 },
        { id: "7", description: "Blower circuit breaker", status: data?.BLOWER_CIRCUIT_BREAKER_I0_6 },
        { id: "8", description: "Compressor circuit breaker fault", status: data?.COMPRESSOR_CIRCUIT_BREAKER_FAULT_I1_1 },
        { id: "9", description: "Compressor motor overheat", status: data?.COMPRESSOR_MOTOR_OVERHEAT_I1_2 },
        { id: "10", description: "Low pressure fault", status: data?.LOW_PRESSURE_FAULT_I1_3 },
        { id: "11", description: "High pressure fault", status: data?.HIGH_PRESSURE_FAULT_I1_4 },
        { id: "12", description: "Three phase monitor fault", status: data?.THREE_PHASE_MONITOR_FAULT_I2_0 },
        { id: "13", description: "Heater TOP fault", status: data?.HEATER_TOP_FAULT_I2_1 },
        { id: "14", description: "Condenser fan 1 circuit breaker fault", status: data?.COND_FAN1_CIRCUIT_BREAKER_FAULT_I2_2 },
        { id: "15", description: "Heater circuit breaker fault", status: data?.HEATER_CIRCUIT_BREAKER_FAULT_I2_3 },
        { id: "16", description: "Heater RCCB fault", status: data?.HEATER_RCCB_FAULT_I2_4 },
        { id: "17", description: "Condenser fan door open", status: data?.CONDENSER_FAN_DOOR_OPEN_I2_5 },
    ];

    const gtpl_116_faultStatus = [
        { id: "1", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker },
        { id: "2", description: "Blower drive", status: data?.Blower_drive },
        { id: "3", description: "Blower in operation", status: data?.Blower_in_operation },
        { id: "4", description: "Heater drive fault", status: data?.Heater_drive_fault },
        { id: "5", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault },
        { id: "6", description: "Condenser fan2 TOP fault", status: data?.Condenser_fan2_TOP_fault },
        { id: "7", description: "Condenser fan drive fault", status: data?.Condenser_fan_drive_fault },
        { id: "8", description: "Compressor oil low", status: data?.Compressor_oil_low },
        { id: "9", description: "Compressor circuit breaker fault", status: data?.Compressor_circuit_breaker_fault },
        { id: "10", description: "Compressor motor overheat", status: data?.Compressor_motor_overheat },
        { id: "11", description: "Low Pressure Fault", status: data?.Low_Pressure_Fault },
        { id: "12", description: "High pressure fault", status: data?.High_pressure_fault },
        { id: "13", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault },
        { id: "14", description: "Heater TOP fault", status: data?.Heater_TOP_fault },
        { id: "15", description: "Cond fan1 circuit breaker fault", status: data?.Cond_fan1_circuit_breaker_fault },
        { id: "16", description: "Heater circuit breaker fault", status: data?.Heater_circuit_breaker_fault },
        { id: "17", description: "Heater RCCB fault", status: data?.Heater_RCCB_fault },
        { id: "18", description: "Condenser fan1 door open", status: data?.Condenser_fan1_door_open },
        { id: "19", description: "Cond fan2 circuit breaker", status: data?.Cond_fan2_circuit_breaker },
        { id: "20", description: "Condenser fan2 door open", status: data?.Condenser_fan2_door_open },
    ];

    const gtpl_124_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker fault", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module FDK error", status: data?.Comp_module_fdk_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Comp_in_operation_I0_2 },
        { id: "I0.3", description: "Oil level", status: data?.Oil_level_I0_3 },
        { id: "I0.4", description: "Blower drive", status: data?.Blower_drive_I0_4 },
        { id: "I0.5", description: "Blower in operation", status: data?.Blower_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker fault", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan 1 TOP", status: data?.Cond_fan1_TOP_I0_7 },
        { id: "I1.0", description: "Condenser fan 1 circuit breaker fault", status: data?.Cond_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare input", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High pressure fault", status: data?.High_pressure_fault_I1_3 },
        { id: "I1.4", description: "Start/Stop signal", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare input", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Condenser fan 2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Condenser fan 3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
        { id: "I2.4", description: "Condenser fan 4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
        { id: "I2.5", description: "Condenser fan 2 circuit breaker fault", status: data?.Cond_fan2_cb_fault_I2_5 },
        { id: "I2.6", description: "Condenser fan 3 circuit breaker fault", status: data?.Cond_fan3_cb_fault_I2_6 },
        { id: "I2.7", description: "Condenser fan 4 circuit breaker fault", status: data?.Cond_fan4_cb_fault_I2_7 },
    ];

    const gtpl_061_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Spare", status: data?.Spare_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_2 },
        { id: "I2.3", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_3 },
        { id: "I2.4", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_4 },
        { id: "I2.5", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_5 },
        { id: "I2.6", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_6 },
        { id: "I2.7", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_7 },
    ];

    const gtpl_139_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond__fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Spare", status: data?.Spare_I2_3 },
        { id: "I2.4", description: "Spare", status: data?.Spare_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond__fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Spare", status: data?.Spare_I2_6 },
        { id: "I2.7", description: "Spare", status: data?.Spare_I2_7 },
    ];

    const gtpl_144_faultStatus = [
        { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
        { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
        { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
        { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
        { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
        { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
        { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
        { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
        { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
        { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
        { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
        { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
        { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
        { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
        { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
        { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond__fan2_TOP_fault_I2_2 },
        { id: "I2.3", description: "Spare", status: data?.Spare_I2_3 },
        { id: "I2.4", description: "Spare", status: data?.Spare_I2_4 },
        { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond__fan2_circuit_breaker_fault_I2_5 },
        { id: "I2.6", description: "Spare", status: data?.Spare_I2_6 },
        { id: "I2.7", description: "Spare", status: data?.Spare_I2_7 },
    ];

    const selectedList =
        isGTPL118 ? gtpl_118_faultStatus :
        isGT80E ? s7_200_faultStatus :
            isGtpl115 ? gtpl_115_faultStatus :
                isGtpl124 ? gtpl_124_faultStatus :
                    (isGtpl122 || isGtpl1200_02) ? s7_1200_faultStatus :
                        isGTPL116 ? gtpl_116_faultStatus :
                            isGTPL132 ? gtpl_132_faultStatus :
                                isGTPL134_135 ? gtpl_134_135_faultStatus :
                                    isGTPL136 ? gtpl_136_faultStatus :
                                        isGTPL137 ? gtpl_137_faultStatus :
                                            isGTPL138 ? gtpl_138_faultStatus :
                                                isGTPL061 ? gtpl_061_faultStatus :
                                                    isGTPL139 ? gtpl_139_faultStatus :
                                                        isGTPL144 ? gtpl_144_faultStatus :
                                                            [];

    const activeAlerts = selectedList.filter(item => isStatusFault(item.status)).length;
    const handleBack = () => router.back();

    const renderItem = ({ item, index }: any) => {
        const isFault = isStatusFault(item.status);
        const isCondenserFan1TopFault = isGTPL132 && (item.id === 'I0.2' || item.id === 'I1.2' || item.id === "I2.0");
        const shouldShowRed = isCondenserFan1TopFault ? !isFault : isFault;

        return (
            <View
                style={[
                    styles.inputCard,
                    {
                        backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                        borderColor: shouldShowRed ? '#ef444430' : 'rgba(0,0,0,0.05)'
                    }
                ]}
            >
                <View style={[styles.idBadge, { backgroundColor: shouldShowRed ? '#ef444410' : '#3b82f610' }]}>
                    <ThemedText style={[styles.idText, { color: shouldShowRed ? '#ef4444' : '#3b82f6' }]}>{item.id}</ThemedText>
                </View>

                <View style={styles.inputInfo}>
                    <ThemedText style={styles.inputDescription}>{item.description}</ThemedText>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: shouldShowRed ? '#ef4444' : '#10b981' }]} />
                        <ThemedText style={[styles.statusLabel, { color: shouldShowRed ? '#ef4444' : '#10b981' }]}>
                            {shouldShowRed ? 'Active Alert' : 'Normal Operation'}
                        </ThemedText>
                    </View>
                </View>

                <View style={[styles.statusIcon, { backgroundColor: shouldShowRed ? '#ef4444' : '#10b981' }]}>
                    {shouldShowRed ? <AlertCircle size={20} color="#ffffff" /> : <CheckCircle2 size={20} color="#ffffff" />}
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerTitle}>SYSTEM INPUTS</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device}</ThemedText>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statValue}>{selectedList.length}</ThemedText>
                        <ThemedText style={styles.statLabel}>Total</ThemedText>
                    </View>
                    <View style={[styles.statItem, { backgroundColor: activeAlerts > 0 ? '#ef444420' : 'rgba(0,0,0,0.05)' }]}>
                        <ThemedText style={[styles.statValue, { color: activeAlerts > 0 ? '#ef4444' : undefined }]}>{activeAlerts}</ThemedText>
                        <ThemedText style={styles.statLabel}>Alerts</ThemedText>
                    </View>
                </View>
            </View>

            <FlatList
                data={selectedList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <View style={styles.searchBar}>
                            <Search size={18} color="#64748b" />
                            <ThemedText style={styles.searchText}>Search inputs...</ThemedText>
                        </View>
                    </View>
                }
            />

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.analogButton}
                    onPress={() => router.push(`/menu/${device}/inputs/analog`)}
                >
                    <Activity size={20} color="#ffffff" />
                    <ThemedText style={styles.analogButtonText}>View Analog Inputs</ThemedText>
                    <ChevronRight size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerSubtitle: { fontSize: 12, opacity: 0.6 },
    statsContainer: { flexDirection: 'row', gap: 12 },
    statItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statValue: { fontSize: 14, fontWeight: '800' },
    statLabel: { fontSize: 8, opacity: 0.5, textTransform: 'uppercase' },
    listContent: { padding: 20 },
    listHeader: { marginBottom: 20 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        padding: 12,
        gap: 10,
    },
    searchText: { fontSize: 14, color: '#64748b' },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        gap: 16,
    },
    idBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    idText: { fontSize: 14, fontWeight: '800', fontFamily: 'monospace' },
    inputInfo: { flex: 1 },
    inputDescription: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusLabel: { fontSize: 11, fontWeight: '600' },
    statusIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
    analogButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    analogButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});
