import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    ChevronLeft,
    Gauge,
    GripVertical,
    Settings,
    Thermometer,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── Shared Machine Configs ──────────────────────────────────────────────────

const sharedS7_1200_config = {
    displayName: "S7-1200 Machine",
    inputs: {
        "Suction Pressure": "LP_value",
        "Discharge Pressure": "HP_value",
        "T2.1 Ambient Temp": "T2_1_ambient_temp",
        "T2.2 Ambient Temp": "T2_2_ambient_temp",
        "T1.1 Cold Temp": "T1_1_cold_air_temp",
        "T1.2 Cold Temp": "T1_2_cold_air_temp",
        "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
        "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
        "Blower Speed": "Blower_speed",
        "Condenser fan speed": "Cond_fan_speed",
        "Hot Gas Valve": "Hot_valve_speed",
        "Afterheat Valve": "AHT_valve_speed",
    },
};

const GTPL_132_config = {
    displayName: "S7-1200 Machine",
    inputs: {
        "Suction pressure": "LP_value",
        "Discharge pressure": "HP_value",
        "T0 probe #1 (Afterheater)": "T0_1_air_outlet_temp",
        "T0 probe #2 (Afterheater)": "T0_2_air_outlet_temp",
        "T1 probe #1 (Cold Air)": "T1_1_cold_air_temp",
        "T1 probe #2 (Cold Air)": "T1_2_cold_air_temp",
        "T2 probe #1 (Ambient Air)": "T2_1_ambient_temp",
        "T2 probe #2 (Ambient Air)": "T2_2_ambient_temp",
        "TH probe #1 (Supply Air)": "TH_1_supply_air_temp",
        "TH probe #2 (Supply Air)": "TH_2_supply_air_temp",
    },
    outputs: {
        "Blower speed": "Blower_speed",
        "Cond. Fan speed": "Condenser_fan_speed",
        "Hot gas valve": "Hot_valve_speed",
        "Afterheat valve": "AHT_vale_speed",
        "Heater": "Heater_speed",
    },
};

const GTPL_061_config = {
    displayName: "GTPL-061 Machine",
    inputs: {
        "Suction Pressure": "LP_value",
        "Discharge Pressure": "HP_value",
        "T2.1 Ambient Temp": "T2_1_ambient_temp",
        "T2.2 Ambient Temp": "T2_2_ambient_temp",
        "T1.1 Cold Temp": "T1_1_cold_air_temp",
        "T1.2 Cold Temp": "T1_2_cold_air_temp",
        "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
        "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
        "Blower Speed": "Blower_speed",
        "Hot Gas Valve": "Hot_valve_speed",
        "Afterheat Valve": "AHT_valve_speed",
    },
};

const GTPL_134_135_config = {
    displayName: "S7-1200 Machine",
    inputs: {
        "Suction Pressure": "LP_value",
        "Discharge Pressure": "HP_value",
        "T2.1 Ambient Temp": "T2_temp_mean",
        "T1.1 Cold Temp": "T1_temp_mean",
        "T0.1 Air Outlet Temp": "T0_temp_mean",
    },
    outputs: {
        "Blower Speed": "Blower_speed",
        "Condenser fan speed": "Cond_fan_speed",
        "Hot Gas Valve": "Hot_valve_speed",
        "Afterheat Valve": "AHT_valve_speed",
    },
};

const GTPL_136_config = {
    displayName: "GTPL-136 Machine",
    inputs: {
        "Suction Pressure": "LP_value",
        "Discharge Pressure": "HP_value",
        "T2.1 Ambient Temp": "T2_1_ambient_temp",
        "T2.2 Ambient Temp": "T2_2_ambient_temp",
        "T1.1 Cold Temp": "T1_1_cold_air_temp",
        "T1.2 Cold Temp": "T1_2_cold_air_temp",
        "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
        "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
        "Blower Speed": "Blower_speed",
        "Condenser fan speed": "Condenser_fan_speed",
        "Hot Gas Valve": "Hot_valve_speed",
        "Afterheat Valve": "AHT_valve_speed",
    },
};

const machineConfigs: Record<string, { inputs: Record<string, string>; outputs: Record<string, string>; displayName: string }> = {
    "GTPL-115-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-30-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-119-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-120-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-116-gT-240E-S7-1200": sharedS7_1200_config,
    "GTPL-117-gT-320E-S7-1200": sharedS7_1200_config,
    "GTPL-124-GT-450T-S7-1200": sharedS7_1200_config,
    "GTPL-121-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-122-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-133-GT-650T-S7-1200": sharedS7_1200_config,
    "GTPL-131-GT-650T-S7-1200": sharedS7_1200_config,
    "GTPL-132-300-AP-S7-1200": GTPL_132_config,
    "GTPL-142-gT-450AP-S7-1200": GTPL_132_config,
    "GTPL-123-GT-450AP": GTPL_132_config,
    "GTPL-143-gT-450AP-S7-1200": GTPL_132_config,
    "GTPL-134-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-135-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-145-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-136-gT-450AP": GTPL_136_config,
    "GTPL-137-GT-450T-S7-1200": sharedS7_1200_config,
    "GTPL-138-GT-450T-S7-1200": sharedS7_1200_config,
    "GTPL-061-gT-450T-S7-1200": GTPL_061_config,
    "GTPL-139-GT-300AP-S7-1200": sharedS7_1200_config,
    "GTPL-148-GT-450T-S7-1200": sharedS7_1200_config,
    "default": {
        displayName: "Default Machine",
        inputs: {
            "Suction pressure": "LP",
            "Discharge pressure": "HP",
            "T0 probe #1 (Afterheater)": "AIR_OUTLET_TEMP",
            "T1 probe #1 (Cold Air)": "COLD_AIR_TEMP_T1",
            "T2 probe #1 (Ambient Air)": "AMBIENT_AIR_TEMP_T2",
            "TH probe #1 (Supply Air)": "AFTER_HEATER_TEMP_Th",
        },
        outputs: {
            "Blower speed": "BLOWER_RPM",
            "Cond. Fan speed": "Condenser_fan_speed",
            "Hot gas valve": "HOT_GAS_VALVE_RPM",
            "Afterheat valve": "AFTER_HEAT_VALVE_RPM",
            "Heater": "Heater_speed",
        },
    },
};

// Bar machines (GTPL-137, GTPL-138) display pressure in bar instead of psi
const BAR_MACHINES = ["GTPL-137-GT-450T-S7-1200", "GTPL-138-GT-450T-S7-1200"];

// Group inputs by type (4-20mA and RTD)
const groupInputsByType = (inputs: Array<{ description: string; field: string }>, isBarMachine: boolean) => {
    const grouped = {
        analog4_20mA: [] as Array<{ description: string; field: string; unit: string }>,
        analogRTD: [] as Array<{ description: string; field: string; unit: string }>,
    };

    inputs.forEach(input => {
        if (input.description.toLowerCase().includes('pressure')) {
            grouped.analog4_20mA.push({
                ...input,
                unit: isBarMachine ? 'bar' : 'psi',
            });
        } else {
            grouped.analogRTD.push({
                ...input,
                unit: '°C'
            });
        }
    });

    return grouped;
};

const getAnalogConfig = (device: string, data: any) => {
    const currentConfig = machineConfigs[device] || machineConfigs.default;
    const isBarMachine = BAR_MACHINES.includes(device);
    const analogInputs = Object.entries(currentConfig.inputs).map(([description, field]) => ({
        description,
        field,
        id: field,
    }));

    const grouped = groupInputsByType(analogInputs, isBarMachine);

    // Analog outputs from config
    const analogOutputs = Object.entries(currentConfig.outputs).map(([description, field]) => ({
        description,
        field,
        id: field,
        unit: '%',
        section: "ANALOG OUTPUTS",
        isOutput: true,
    }));

    // Create flat array of all items for simpler rendering
    const allItems = [
        ...grouped.analog4_20mA.map(item => ({
            ...item,
            id: item.field,
            section: "ANALOG INPUTS (4-20mA)",
            isPressure: true,
        })),
        ...grouped.analogRTD.map(item => ({
            ...item,
            id: item.field,
            section: "ANALOG INPUTS (RTD Type)",
            isRTD: true,
        })),
        ...analogOutputs,
    ];

    return allItems;
};

const getIcon = (description: string) => {
    const d = description.toLowerCase();
    if (d.includes('pressure')) return <Gauge size={16} color="#3b82f6" />;
    if (d.includes('temp')) return <Thermometer size={16} color="#f97316" />;
    if (d.includes('valve')) return <Settings size={16} color="#8b5cf6" />;
    if (d.includes('heater')) return <Zap size={16} color="#f59e0b" />;
    return <Activity size={16} color="#64748b" />;
};

const getValueColor = (value: string | number, unit: string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (unit === '°C') {
        if (numValue > 40) return '#ef4444';
        if (numValue < 10) return '#3b82f6';
        return '#10b981';
    }
    
    if (unit === 'psi' || unit === 'bar') {
        const threshold = unit === 'bar' ? 13.8 : 200;
        if (numValue > threshold) return '#f97316';
        return '#3b82f6';
    }
    
    if (unit === '%') {
        if (numValue > 80) return '#ef4444';
        if (numValue > 50) return '#f59e0b';
        return '#10b981';
    }
    
    return '#3b82f6';
};

type AnalogItem = {
    id: string;
    description: string;
    field: string;
    unit: string;
    section: string;
    isPressure?: boolean;
    isRTD?: boolean;
    isOutput?: boolean;
};

export default function AnalogInputsScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected, formatValue } = useAutoData(device || '');
    const analogInputs = getAnalogConfig(device || '', data);

    // Group items by section for rendering sections
    const itemsBySection = analogInputs.reduce((acc: Record<string, AnalogItem[]>, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    const sections = Object.keys(itemsBySection);

    const handleBack = () => router.back();

    const isBarMachine = BAR_MACHINES.includes(device || '');

    const renderItem = ({ item }: { item: AnalogItem }) => {
        let val = data?.[item.field] || 0;
        // Convert psi to bar for bar machines (1 psi = 0.0689476 bar)
        if (isBarMachine && item.unit === 'bar') {
            const numVal = parseFloat(String(val));
            if (!isNaN(numVal)) val = numVal * 0.0689476;
        }
        const formattedVal = typeof val === 'number' ? val.toFixed(1) : (val || '0.0');
        const numValue = parseFloat(formattedVal);

        // Calculate progress for visualization
        let progress = 0;
        if (item.isOutput) {
            progress = Math.min(100, Math.max(0, numValue)); // Already in %
        } else if (item.isPressure) {
            const maxPressure = isBarMachine ? 20 : 300;
            progress = Math.min(100, (numValue / maxPressure) * 100);
        } else if (item.isRTD) {
            progress = Math.min(100, (numValue / 50) * 100); // Assuming max temp of 50°C
        }

        const valueColor = getValueColor(numValue, item.unit);
        const Icon = getIcon(item.description);

        return (
            <View
                style={[
                    styles.analogCard,
                    {
                        backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                    }
                ]}
            >
                <View style={styles.analogHeader}>
                    <View style={styles.iconContainer}>
                        {Icon}
                    </View>
                    <View style={styles.textContainer}>
                        <ThemedText style={styles.descriptionText}>{item.description}</ThemedText>
                        <View style={styles.idContainer}>
                            <GripVertical size={12} color="#64748b" />
                            <ThemedText style={styles.idText}>{item.id}</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={styles.valueRow}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBg}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${progress}%`,
                                        backgroundColor: valueColor,
                                    }
                                ]}
                            />
                        </View>
                        <ThemedText style={styles.progressLabel}>
                            {progress.toFixed(0)}%
                        </ThemedText>
                    </View>
                    <View style={styles.valueBox}>
                        <ThemedText style={[styles.valueText, { color: valueColor }]}>
                            {formattedVal}
                        </ThemedText>
                        <ThemedText style={styles.unitText}>{item.unit}</ThemedText>
                    </View>
                </View>
            </View>
        );
    };

    const renderSection = (sectionTitle: string) => {
        const sectionItems = itemsBySection[sectionTitle] || [];
        
        return (
            <View style={styles.sectionContainer} key={sectionTitle}>
                <ThemedText style={styles.sectionTitle}>{sectionTitle}</ThemedText>
                {sectionItems.map((item, index) => (
                    <View key={`${item.id}-${index}`}>
                        {renderItem({ item })}
                    </View>
                ))}
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
                    <ThemedText style={styles.headerTitle}>ANALOG INPUTS</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>
                        {device || 'Unknown Device'} • {machineConfigs[device || '']?.displayName || 'Default Machine'}
                    </ThemedText>
                </View>
                <View style={[styles.statusIcon, { backgroundColor: isConnected ? '#10b98120' : '#ef444420' }]}>
                    <Activity size={20} color={isConnected ? '#10b981' : '#ef4444'} />
                </View>
            </View>

            <FlatList
                data={sections}
                renderItem={({ item }) => renderSection(item)}
                keyExtractor={item => item}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.statsOverview}>
                        <View style={styles.statCard}>
                            <Thermometer size={18} color="#f97316" />
                            <ThemedText style={styles.statLabel}>Sensors</ThemedText>
                            <ThemedText style={styles.statValue}>{analogInputs.length}</ThemedText>
                        </View>
                        <View style={[styles.statCard, { borderLeftWidth: 1, borderLeftColor: effective === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            <Zap size={18} color="#3b82f6" />
                            <ThemedText style={styles.statLabel}>Status</ThemedText>
                            <ThemedText style={[styles.statValue, { color: isConnected ? '#10b981' : '#ef4444' }]}>
                                {isConnected ? 'Active' : 'Offline'}
                            </ThemedText>
                        </View>
                    </View>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    statusIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 20,
    },
    statsOverview: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        opacity: 0.5,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '800',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        opacity: 0.7,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    analogCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    analogHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    idText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'monospace',
        color: '#64748b',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    progressContainer: {
        flex: 1,
        gap: 8,
    },
    progressBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: '600',
        opacity: 0.5,
        textAlign: 'center',
    },
    valueBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        minWidth: 70,
        justifyContent: 'flex-end',
    },
    valueText: {
        fontSize: 20,
        fontWeight: '900',
    },
    unitText: {
        fontSize: 12,
        fontWeight: '700',
        opacity: 0.4,
    },
});