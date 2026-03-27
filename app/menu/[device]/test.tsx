import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    ArrowLeft,
    ChevronLeft,
    Flame,
    Gauge,
    Play,
    Power,
    Settings2,
    Square,
    Thermometer,
    Timer,
    Wind,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TestScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected } = useAutoData(device || '');

    // Pull values from data or fallback
    const [blowerSpeed, setBlowerSpeed] = useState(0);
    const [condFanSpeed, setCondFanSpeed] = useState(0);
    const [compStartDelay, setCompStartDelay] = useState(0);
    const [hotGasValve, setHotGasValve] = useState(0);
    const [afterHeatValve, setAfterHeatValve] = useState(0);
    const [heaterOutput, setHeaterOutput] = useState(0);
    const [solValve, setSolValve] = useState(false);

    // Component running states
    const blowerRunning = data?.BLOWER_START_MANUAL_MOD && !data?.BLOWER_STOP_MANUAL_MODE;
    const condFanRunning = data?.COND_FAN_START_MANUAL_M && !data?.COND_FAN_STOP_MANUAL_M;
    const compRunning = data?.COMPRESSOR_START_MANUAL && !data?.COMPRESSOR_STOP_MANUAL;
    const hotGasRunning = data?.HOT_GAS_VALVE_START_MAN && !data?.HOT_GAS_VALVE_STOP_MAN;
    const ahtRunning = data?.AHT_START_MANUAL_MODE && !data?.AHT_STOP_MANUAL_MODE;
    const heaterRunning = data?.HEATER_START_MANUAL && !data?.HEATER_STOP_MANUAL;

    useEffect(() => {
        if (data) {
            if (data.BLOWER_SET_POINT_MANUAL_MODE != null) setBlowerSpeed(data.BLOWER_SET_POINT_MANUAL_MODE);
            if (data.CONDN_FAN_SET_POINT_MANUAL != null) setCondFanSpeed(data.CONDN_FAN_SET_POINT_MANUAL);
            if (data.DELAY_TIME != null) setCompStartDelay(data.DELAY_TIME);
            if (data.HOT_GAS_VALVE_SET_POINT_MANUAL != null) setHotGasValve(data.HOT_GAS_VALVE_SET_POINT_MANUAL);
            if (data.AFTER_HEAT_VALVE_SET_POINT_MANUAL != null) setAfterHeatValve(data.AFTER_HEAT_VALVE_SET_POINT_MANUAL);
            if (data.MANUAL_Heater_Output != null) setHeaterOutput(data.MANUAL_Heater_Output);
        }
    }, [data]);

    const handleBack = () => router.back();
    const handleNext = () => router.push(`/menu/auto/${device}`);

    const handleSliderChange = (component: string, value: number) => {
        // In a real app, this would call an API to update the PLC
        Alert.alert('Manual Control', `${component} set to ${value}%`);
    };

    const handleStartStop = (component: string, start: boolean) => {
        // In a real app, this would call an API to start/stop the component
        Alert.alert('Manual Control', `${component} ${start ? 'STARTED' : 'STOPPED'}`);
    };

    const ControlCard = ({ 
        title, 
        icon: Icon, 
        isRunning, 
        children, 
        color = '#3b82f6',
        hide = false 
    }: any) => {
        if (hide) return null;
        
        return (
            <View style={[styles.card, { backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff' }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                        <Icon size={22} color={color} />
                    </View>
                    <View style={styles.headerText}>
                        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
                        <View style={styles.statusBadge}>
                            <View style={[styles.statusDot, { backgroundColor: isRunning ? '#10b981' : '#64748b' }]} />
                            <ThemedText style={[styles.statusText, { color: isRunning ? '#10b981' : '#64748b' }]}>
                                {isRunning ? 'RUNNING' : 'STOPPED'}
                            </ThemedText>
                        </View>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    {children}
                </View>
            </View>
        );
    };

    // Check if heater should be shown
    const showHeater = device !== "GTPL-132-300-AP-S7-1200";

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerTitle}>COMPONENT TESTING</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device} • Manual Control</ThemedText>
                </View>
                <TouchableOpacity style={styles.historyBtn}>
                    <Activity size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Row 1: BLOWER and COND FAN */}
                <View style={styles.row}>
                    <View style={styles.col}>
                        <ControlCard title="BLOWER" icon={Wind} isRunning={blowerRunning} color="#06b6d4">
                            <View style={styles.controlRow}>
                                <View style={styles.sliderHeader}>
                                    <ThemedText style={styles.controlLabel}>Speed Control</ThemedText>
                                    <View style={styles.valueDisplay}>
                                        <Gauge size={16} color="#06b6d4" />
                                        <ThemedText style={[styles.valueText, { color: '#06b6d4' }]}>{blowerSpeed}%</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.sliderContainer}>
                                    <View style={styles.sliderTrack}>
                                        <View 
                                            style={[
                                                styles.sliderFill, 
                                                { width: `${blowerSpeed}%`, backgroundColor: '#06b6d4' }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.sliderLabels}>
                                        <ThemedText style={styles.sliderLabel}>0%</ThemedText>
                                        <ThemedText style={styles.sliderLabel}>100%</ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => handleStartStop('Blower', true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => handleStartStop('Blower', false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>

                    <View style={styles.col}>
                        <ControlCard title="COND FAN" icon={Settings2} isRunning={condFanRunning} color="#6366f1">
                            <View style={styles.controlRow}>
                                <View style={styles.sliderHeader}>
                                    <ThemedText style={styles.controlLabel}>Speed Control</ThemedText>
                                    <View style={styles.valueDisplay}>
                                        <Gauge size={16} color="#6366f1" />
                                        <ThemedText style={[styles.valueText, { color: '#6366f1' }]}>{condFanSpeed}%</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.sliderContainer}>
                                    <View style={styles.sliderTrack}>
                                        <View 
                                            style={[
                                                styles.sliderFill, 
                                                { width: `${condFanSpeed}%`, backgroundColor: '#6366f1' }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.sliderLabels}>
                                        <ThemedText style={styles.sliderLabel}>0%</ThemedText>
                                        <ThemedText style={styles.sliderLabel}>100%</ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => handleStartStop('Cond Fan', true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => handleStartStop('Cond Fan', false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>
                </View>

                {/* Row 2: SOL VALVE and COMPRESSOR */}
                <View style={styles.row}>
                    <View style={styles.col}>
                        <ControlCard title="SOL VALVE" icon={Zap} isRunning={solValve} color="#f59e0b">
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => setSolValve(true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => setSolValve(false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>

                    <View style={styles.col}>
                        <ControlCard title="COMPRESSOR" icon={Power} isRunning={compRunning} color="#ef4444">
                            <View style={styles.controlRow}>
                                <View style={styles.labelWithIcon}>
                                    <Timer size={16} color="#64748b" />
                                    <ThemedText style={styles.controlLabel}>Start Delay</ThemedText>
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={compStartDelay.toString()}
                                        onChangeText={(text) => setCompStartDelay(Number(text) || 0)}
                                        style={[styles.input, { color: effective === 'dark' ? '#ffffff' : '#000000' }]}
                                        keyboardType="numeric"
                                    />
                                    <ThemedText style={styles.inputUnit}>Sec</ThemedText>
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => handleStartStop('Compressor', true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => handleStartStop('Compressor', false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>
                </View>

                {/* Row 3: HOT GAS VALVE and AFTERHEAT VALVE */}
                <View style={styles.row}>
                    <View style={styles.col}>
                        <ControlCard title="HOT GAS VALVE" icon={Flame} isRunning={hotGasRunning} color="#f97316">
                            <View style={styles.controlRow}>
                                <View style={styles.sliderHeader}>
                                    <ThemedText style={styles.controlLabel}>Valve Position</ThemedText>
                                    <View style={styles.valueDisplay}>
                                        <Gauge size={16} color="#f97316" />
                                        <ThemedText style={[styles.valueText, { color: '#f97316' }]}>{hotGasValve}%</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.sliderContainer}>
                                    <View style={styles.sliderTrack}>
                                        <View 
                                            style={[
                                                styles.sliderFill, 
                                                { width: `${hotGasValve}%`, backgroundColor: '#f97316' }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.sliderLabels}>
                                        <ThemedText style={styles.sliderLabel}>0%</ThemedText>
                                        <ThemedText style={styles.sliderLabel}>100%</ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => handleStartStop('Hot Gas Valve', true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => handleStartStop('Hot Gas Valve', false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>

                    <View style={styles.col}>
                        <ControlCard title="AFTERHEAT VALVE" icon={Thermometer} isRunning={ahtRunning} color="#ec4899">
                            <View style={styles.controlRow}>
                                <View style={styles.sliderHeader}>
                                    <ThemedText style={styles.controlLabel}>Valve Position</ThemedText>
                                    <View style={styles.valueDisplay}>
                                        <Gauge size={16} color="#ec4899" />
                                        <ThemedText style={[styles.valueText, { color: '#ec4899' }]}>{afterHeatValve}%</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.sliderContainer}>
                                    <View style={styles.sliderTrack}>
                                        <View 
                                            style={[
                                                styles.sliderFill, 
                                                { width: `${afterHeatValve}%`, backgroundColor: '#ec4899' }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.sliderLabels}>
                                        <ThemedText style={styles.sliderLabel}>0%</ThemedText>
                                        <ThemedText style={styles.sliderLabel}>100%</ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.startBtn]} 
                                    onPress={() => handleStartStop('Afterheat Valve', true)}
                                >
                                    <Play size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>START</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.btn, styles.stopBtn]} 
                                    onPress={() => handleStartStop('Afterheat Valve', false)}
                                >
                                    <Square size={18} color="#ffffff" />
                                    <ThemedText style={styles.btnText}>STOP</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ControlCard>
                    </View>
                </View>

                {/* HEATER - Conditionally shown */}
                {showHeater && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <ControlCard title="HEATER" icon={Flame} isRunning={heaterRunning} color="#eab308">
                                <View style={styles.controlRow}>
                                    <View style={styles.labelWithIcon}>
                                        <Gauge size={16} color="#eab308" />
                                        <ThemedText style={styles.controlLabel}>Output Control</ThemedText>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            value={heaterOutput.toString()}
                                            onChangeText={(text) => setHeaterOutput(Number(text) || 0)}
                                            style={[styles.input, { color: effective === 'dark' ? '#ffffff' : '#000000' }]}
                                            keyboardType="numeric"
                                        />
                                        <ThemedText style={styles.inputUnit}>%</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.actionRow}>
                                    <TouchableOpacity 
                                        style={[styles.btn, styles.startBtn]} 
                                        onPress={() => handleStartStop('Heater', true)}
                                    >
                                        <Play size={18} color="#ffffff" />
                                        <ThemedText style={styles.btnText}>ON</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.btn, styles.stopBtn]} 
                                        onPress={() => handleStartStop('Heater', false)}
                                    >
                                        <Square size={18} color="#ffffff" />
                                        <ThemedText style={styles.btnText}>OFF</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </ControlCard>
                        </View>
                    </View>
                )}

                {/* Navigation Buttons */}
                <View style={styles.navigationRow}>
                    <TouchableOpacity 
                        style={styles.navButton} 
                        onPress={handleBack}
                    >
                        <ArrowLeft size={20} color="#3b82f6" />
                        <ThemedText style={styles.navButtonText}>BACK</ThemedText>
                    </TouchableOpacity>
                    
           
                </View>
            </ScrollView>
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
    historyBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    col: {
        flex: 1,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        gap: 16,
    },
    controlRow: {
        gap: 12,
    },
    sliderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    controlLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    labelWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    valueDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '800',
    },
    sliderContainer: {
        marginTop: 4,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    sliderFill: {
        height: '100%',
        borderRadius: 3,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 10,
        color: '#64748b',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        width: 60,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
    },
    inputUnit: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    btn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtn: {
        backgroundColor: '#10b981',
    },
    stopBtn: {
        backgroundColor: '#ef4444',
    },
    btnText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '800',
    },
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 16,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    nextButton: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3b82f6',
    },
    nextButtonText: {
        color: '#ffffff',
    },
});