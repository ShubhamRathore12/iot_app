import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    ChevronLeft,
    Clock,
    Fan,
    Thermometer,
    Wind,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// List of devices that should show both "Aeration Without Heating" and "Aeration With Heating"
const DUAL_AERATION_DEVICES = [
    "GTPL-108-gT-40E-P-S7-200",
    "GTPL-109-gT-40E-P-S7-200",
    "GTPL-110-gT-40E-P-S7-200",
    "GTPL-111-gT-80E-P-S7-200",
    "GTPL-112-gT-80E-P-S7-200",
    "GTPL-113-gT-80E-P-S7-200",
    "GTPL-118-gT-60T-S7-200"
];

// List of devices that should show heaters
const HEATER_ENABLED_DEVICES = [
    "GTPL-30-gT-180E-S7-1200",
    "GTPL-114-gT-80E-P-S7-200",
    "GTPL-115-gT-80E-P-S7-200",
    "GTPL-116-gT-80E-P-S7-200",
    "GTPL-117-gT-80E-P-S7-200",
    "GTPL-119-gT-80E-P-S7-200",
    "GTPL-120-gT-180E-S7-1200"
];

export default function AerationScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected, error, formatValue } = useAutoData(device || '');
    const [shouldShowWithoutHeatingOnly, setShouldShowWithoutHeatingOnly] = useState(false);
    const [shouldShowHeaters, setShouldShowHeaters] = useState(false);
    const [continuousMode, setContinuousMode] = useState(false);
    const [duration, setDuration] = useState(0);
    const [deltaTemp, setDeltaTemp] = useState(0);
    const [runningHours, setRunningHours] = useState(0);
    const [runningMinutes, setRunningMinutes] = useState(0);

    useEffect(() => {
        if (device && DUAL_AERATION_DEVICES.includes(device)) {
            setShouldShowWithoutHeatingOnly(false); // Show both modes
        } else {
            setShouldShowWithoutHeatingOnly(true); // Show single mode only
        }
        
        if (device && HEATER_ENABLED_DEVICES.includes(device)) {
            setShouldShowHeaters(true); // Show heaters
        } else {
            setShouldShowHeaters(false); // Hide heaters
        }
    }, [device]);

    useEffect(() => {
        // Initialize values from data
        if (data) {
            setContinuousMode(
                data?.CONTINUOUS_MODE === 'tr' || data?.Continuous_mode === 'tr'
            );
            setDuration(data?.SET_DURATION || data?.Aeration_duration_set || 0);
            setDeltaTemp(data?.DELTA_SET || data?.Delta_set_to_aeration || 0);
            setRunningHours(data?.Running_time_hour || 0);
            setRunningMinutes(data?.Running_time_minute || 0);
        }
    }, [data]);

    const handleBack = () => router.back();

    const isWithoutHeatRunning = data?.AERATION_WITHOUT_HEATER_START === 'tr' || 
                                 data?.AERATION_WITHOUT_HEATER_START === true || 
                                 data?.Aeration_start == 1;
    const isWithHeatRunning = data?.AERATION_WITH_HEAT === 'tr' || 
                              data?.AERATION_WITH_HEAT === true;
    const isAnyRunning = isWithoutHeatRunning || isWithHeatRunning;

    // Temperature values with fallbacks
    const afterHeatTemp = data?.AFTER_HEATER_TEMP_Th || data?.TH_temp_mean || data?.T0_temp_mean;
    const ambientTemp = data?.AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2 || data?.T2_temp_mean;
    const setPointTemp = data?.T1_SET_POINT || data?.Th_set_point;
    
    // Control values with fallbacks
    const blowerSpeed = data?.Value_to_Display_EVAP_ACT_SPEED || data?.BLOWER_RPM || data?.Blower_speed;
    const heaterSpeed = data?.Value_to_Display_HEATER || data?.Heater_speed;
    const deltaSet = data?.DELTA_SET || data?.Delta_set_to_aeration;

    // Calculate percentages for progress bars
    const durationProgress = Math.min(100, (duration / 24) * 100);
    const deltaTempProgress = Math.min(100, ((deltaTemp || 0) / 15) * 100);
    const runningTimeProgress = Math.min(100, ((runningHours * 60 + runningMinutes) / (24 * 60)) * 100);
    const blowerProgress = parseFloat(blowerSpeed as any) || 0;
    const heaterProgress = parseFloat(heaterSpeed as any) || 0;

    // Progress for Without Heating
    const runningTimeHours = data?.Running_time_hour || 0;
    const aerationDurationSet = data?.Aeration_duration_set || 1;
    const withoutHeatingProgress = Math.min(100, (runningTimeHours / aerationDurationSet) * 100);

    // Progress for With Heating
    const heaterTemp = data?.AFTER_HEATER_TEMP_Th || data?.Th_T1 || 0;
    const heaterSetPoint = data?.T1_SET_POINT || data?.Th_set_point || 1;
    const withHeatingProgress = Math.min(100, (heaterTemp / heaterSetPoint) * 100);

    // Function to determine setpoint color based on temperature value
    const getSetPointColor = (temp: any) => {
        const tempValue = parseFloat(temp as any);
        if (isNaN(tempValue)) return '#64748b'; // Gray for invalid values
        if (tempValue < 20) return '#3b82f6'; // Blue - Cold
        if (tempValue < 30) return '#10b981'; // Green - Moderate
        if (tempValue < 40) return '#f59e0b'; // Amber - Warm
        return '#ef4444'; // Red - Hot
    };

    if (!data) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <ThemedText style={styles.loadingText}>Connecting to device...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View>
                    <ThemedText style={styles.headerTitle}>AERATION</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device}</ThemedText>
                    {shouldShowWithoutHeatingOnly && (
                        <ThemedText style={styles.deviceTypeTag}>
                            Without Heating Mode
                        </ThemedText>
                    )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]}>
                    <View style={styles.statusDot} />
                    <ThemedText style={styles.statusText}>{isConnected ? 'LIVE' : 'OFFLINE'}</ThemedText>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                {!isConnected && (
                    <View style={styles.disconnectedBadge}>
                        <ThemedText style={styles.disconnectedText}>
                            Disconnected from PLC – attempting reconnect...
                        </ThemedText>
                    </View>
                )}
                
                {error && (
                    <View style={styles.errorBadge}>
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    </View>
                )}

                <View style={styles.cardsContainer}>
                    {shouldShowWithoutHeatingOnly ? (
                        // Single Aeration Card for non-dual devices
                        <TouchableOpacity 
                            style={[
                                styles.aerationCard,
                                { backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff' },
                                isAnyRunning && styles.activeCard
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <Wind size={24} color={isAnyRunning ? '#10b981' : '#64748b'} />
                                <ThemedText style={[styles.cardTitle, isAnyRunning && styles.activeTitle]}>
                                    AERATION
                                </ThemedText>
                                {isAnyRunning && (
                                    <View style={styles.runningBadge}>
                                        <View style={styles.runningDot} />
                                        <ThemedText style={styles.runningText}>RUNNING</ThemedText>
                                    </View>
                                )}
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <ThemedText style={styles.statLabel}>Blower</ThemedText>
                                    <View style={styles.statValueContainer}>
                                        <Fan size={16} color="#64748b" style={{ marginRight: 4 }} />
                                        <ThemedText style={styles.statValue}>
                                            {formatValue(blowerSpeed, "%")}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.statBox}>
                                    <ThemedText style={styles.statLabel}>Set Point</ThemedText>
                                    <View style={styles.statValueContainer}>
                                        <Thermometer size={16} color={getSetPointColor(setPointTemp)} style={{ marginRight: 4 }} />
                                        <ThemedText style={[styles.statValue, { color: getSetPointColor(setPointTemp) }]}>
                                            {formatValue(setPointTemp, "°C")}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <ThemedText style={styles.statLabel}>Running Time</ThemedText>
                                    <View style={styles.statValueContainer}>
                                        <Clock size={16} color="#64748b" style={{ marginRight: 4 }} />
                                        <ThemedText style={styles.statValue}>
                                            {runningHours || 0}h {runningMinutes || 0}m
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.statBox}>
                                    <ThemedText style={styles.statLabel}>T2 (Ambient)</ThemedText>
                                    <View style={styles.statValueContainer}>
                                        <Thermometer size={16} color="#64748b" style={{ marginRight: 4 }} />
                                        <ThemedText style={styles.statValue}>
                                            {formatValue(ambientTemp, "°C")}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { 
                                                width: `${runningTimeProgress}%`,
                                                backgroundColor: isAnyRunning ? '#10b981' : '#0ea5e9'
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        // Dual Aeration Cards for specified devices
                        <>
                            {/* Aeration Without Heating Card */}
                            <TouchableOpacity 
                                style={[
                                    styles.aerationCard,
                                    { backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff' },
                                    isWithoutHeatRunning && styles.activeCard
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <Wind size={24} color={isWithoutHeatRunning ? '#10b981' : '#64748b'} />
                                    <ThemedText style={[styles.cardTitle, isWithoutHeatRunning && styles.activeTitle]}>
                                        AERATION WITHOUT HEATING
                                    </ThemedText>
                                    {isWithoutHeatRunning && (
                                        <View style={styles.runningBadge}>
                                            <View style={styles.runningDot} />
                                            <ThemedText style={styles.runningText}>RUNNING</ThemedText>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.statsGrid}>
                                    <View style={styles.statBox}>
                                        <ThemedText style={styles.statLabel}>Running Time</ThemedText>
                                        <View style={styles.statValueContainer}>
                                            <Clock size={16} color="#64748b" style={{ marginRight: 4 }} />
                                            <ThemedText style={styles.statValue}>
                                                {runningHours || 0}h {runningMinutes || 0}m
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.statBox}>
                                        <ThemedText style={styles.statLabel}>Set Duration</ThemedText>
                                        <View style={styles.statValueContainer}>
                                            <Activity size={16} color="#64748b" style={{ marginRight: 4 }} />
                                            <ThemedText style={styles.statValue}>
                                                {duration || 0}h
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { 
                                                    width: `${withoutHeatingProgress}%`,
                                                    backgroundColor: isWithoutHeatRunning ? '#10b981' : '#0ea5e9'
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Aeration With Heating Card */}
                            <TouchableOpacity 
                                style={[
                                    styles.aerationCard,
                                    { backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff' },
                                    isWithHeatRunning && styles.activeCard
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <Thermometer size={24} color={isWithHeatRunning ? '#f59e0b' : '#64748b'} />
                                    <ThemedText style={[styles.cardTitle, isWithHeatRunning && styles.activeTitle]}>
                                        AERATION WITH HEATING
                                    </ThemedText>
                                    {isWithHeatRunning && (
                                        <View style={styles.runningBadge}>
                                            <View style={styles.runningDot} />
                                            <ThemedText style={styles.runningText}>RUNNING</ThemedText>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.statsGrid}>
                                    <View style={styles.statBox}>
                                        <ThemedText style={styles.statLabel}>Heater Temp</ThemedText>
                                        <View style={styles.statValueContainer}>
                                            <Thermometer size={16} color="#64748b" style={{ marginRight: 4 }} />
                                            <ThemedText style={styles.statValue}>
                                                {formatValue(afterHeatTemp, "°C")}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.statBox}>
                                        <ThemedText style={styles.statLabel}>Set Point</ThemedText>
                                        <View style={styles.statValueContainer}>
                                            <Activity size={16} color={getSetPointColor(setPointTemp)} style={{ marginRight: 4 }} />
                                            <ThemedText style={[styles.statValue, { color: getSetPointColor(setPointTemp) }]}>
                                                {formatValue(setPointTemp, "°C")}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { 
                                                    width: `${withHeatingProgress}%`,
                                                    backgroundColor: isWithHeatRunning ? '#f59e0b' : '#0ea5e9'
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Aeration Control Card */}
                <View style={styles.controlCard}>
                    <ThemedText style={styles.controlCardTitle}>Aeration Control</ThemedText>
                    
                    {/* Continuous Mode */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlLabelContainer}>
                            <View style={styles.statusIndicator} />
                            <ThemedText style={styles.controlLabel}>Continuous Mode</ThemedText>
                        </View>
                        <Switch
                            value={continuousMode}
                            onValueChange={setContinuousMode}
                            trackColor={{ false: '#d1d5db', true: '#10b981' }}
                            thumbColor={continuousMode ? '#ffffff' : '#ffffff'}
                        />
                    </View>

                    {/* Set Duration (only show if not continuous mode) */}
                    {!continuousMode && (
                        <View style={styles.controlRow}>
                            <View style={styles.controlLabelContainer}>
                                <Zap size={16} color="#8b5cf6" />
                                <ThemedText style={styles.controlLabel}>Set Duration</ThemedText>
                            </View>
                            <View style={styles.valueContainer}>
                                <ThemedText style={styles.valueText}>{duration}h</ThemedText>
                            </View>
                        </View>
                    )}

                    {/* Delta Temperature */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlLabelContainer}>
                            <Thermometer size={16} color="#f59e0b" />
                            <ThemedText style={styles.controlLabel}>Delta(A)</ThemedText>
                        </View>
                        <View style={styles.valueContainer}>
                            <ThemedText style={styles.valueText}>{deltaTemp}°C</ThemedText>
                        </View>
                    </View>

                    {/* Running Time */}
                    <View style={styles.controlRow}>
                        <View style={styles.controlLabelContainer}>
                            <Clock size={16} color="#06b6d4" />
                            <ThemedText style={styles.controlLabel}>Running Time</ThemedText>
                        </View>
                        <View style={styles.valueContainer}>
                            <ThemedText style={styles.valueText}>{runningHours}h {runningMinutes}m</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Temperature and Controls Card */}
                <View style={styles.tempControlCard}>
                    <ThemedText style={styles.controlCardTitle}>Temperature & Controls</ThemedText>
                                        
                    {/* After Heat Temperature */}
                    <View style={styles.tempRow}>
                        <View style={styles.tempLabelContainer}>
                            <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]} />
                            <ThemedText style={styles.controlLabel}>
                                {device === "GTPL-121-gT-1000T-S7-1200" ? "T0" : "TH"} (After Heat)
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.tempValue}>
                            {formatValue(afterHeatTemp, "°C")}
                        </ThemedText>
                    </View>
                
                    {/* Ambient Temperature */}
                    <View style={styles.tempRow}>
                        <View style={styles.tempLabelContainer}>
                            <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]} />
                            <ThemedText style={styles.controlLabel}>T2 (Ambient)</ThemedText>
                        </View>
                        <ThemedText style={styles.tempValue}>
                            {formatValue(ambientTemp, "°C")}
                        </ThemedText>
                    </View>
                
                    {/* Blower Speed with Progress Bar */}
                    <View style={styles.controlProgressRow}>
                        <View style={styles.controlLabelContainer}>
                            <Fan size={16} color="#8b5cf6" />
                            <ThemedText style={styles.controlLabel}>BLOWER</ThemedText>
                        </View>
                        <View style={styles.progressContainer}>
                            <ThemedText style={styles.progressValue}>
                                {formatValue(blowerSpeed, "%")}
                            </ThemedText>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { 
                                            width: `${blowerProgress}%`,
                                            backgroundColor: '#8b5cf6'
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                
                    {/* Heater Status - Only show for heater-enabled devices */}
                    {shouldShowHeaters && (
                        <View style={styles.tempRow}>
                            <View style={styles.tempLabelContainer}>
                                <Thermometer size={16} color="#f59e0b" />
                                <ThemedText style={styles.controlLabel}>HEATER</ThemedText>
                            </View>
                            <ThemedText style={[
                                styles.tempValue,
                                {
                                    color: (heaterSpeed === 'tr' || heaterSpeed === true || parseFloat(heaterSpeed as any) > 0) ? '#10b981' : '#ef4444'
                                }
                            ]}>
                                {(heaterSpeed === 'tr' || heaterSpeed === true || parseFloat(heaterSpeed as any) > 0) ? 'ON' : 'OFF'}
                            </ThemedText>
                        </View>
                    )}
                </View>

           

                {error && (
                    <View style={styles.errorContainer}>
                        <Activity color="#ef4444" size={20} />
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    deviceTypeTag: {
        fontSize: 10,
        color: '#0ea5e9',
        marginTop: 2,
        fontWeight: '600',
    },
    statusBadge: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff',
        marginRight: 6,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },
    disconnectedBadge: {
        backgroundColor: '#ef4444',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    disconnectedText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    cardsContainer: {
        gap: 20,
        marginBottom: 20,
    },
    aerationCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activeCard: {
        borderWidth: 2,
        borderColor: '#0ea5e9',
        elevation: 8,
        shadowOpacity: 0.2,
    },
    activeTitle: {
        color: '#0ea5e9',
    },
    runningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 'auto',
    },
    runningDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff',
        marginRight: 6,
    },
    runningText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0369a1',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 4,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    controlCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    tempControlCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    controlCardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#0369a1',
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    tempRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    controlProgressRow: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    controlLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tempLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    controlLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    valueContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    tempValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ef4444',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'right',
    },
    actionSection: {
        gap: 12,
    },
    controlButton: {
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    controlButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    backButtonContainer: {
        height: 50,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    errorContainer: {
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});