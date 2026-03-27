import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Clock,
    RotateCcw,
    Timer,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OperatingHoursScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected } = useAutoData(device || '');

    const hours = data?.RUNNING_HOUR ?? data?.Running_hours ?? '--';
    const minutes = data?.RUNNING_MINUTE ?? data?.Running_hours_min ?? '--';

    const handleBack = () => router.back();

    const handleReset = () => {
        Alert.alert(
            t('reset_operating_hours') || 'Reset Operating Hours',
            t('reset_warning') || 'This will reset the operating hours counter to zero. This action cannot be undone.',
            [
                { text: t('cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('reset') || 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        // Reset logic - send command to PLC
                    },
                },
            ]
        );
    };

    const isDark = effective === 'dark';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const subtleBg = isDark ? '#334155' : '#f1f5f9';

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={isDark ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerTitle}>OPERATING HOURS</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>
                        {device || 'Unknown Device'}
                    </ThemedText>
                </View>
                <View style={[styles.statusIcon, { backgroundColor: isConnected ? '#10b98120' : '#ef444420' }]}>
                    <Clock size={20} color={isConnected ? '#10b981' : '#ef4444'} />
                </View>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
                {/* Runtime Display */}
                <View style={[styles.runtimeCard, { backgroundColor: cardBg }]}>
                    <View style={styles.runtimeIconRow}>
                        <View style={[styles.runtimeIconBox, { backgroundColor: '#6366f115' }]}>
                            <Timer size={28} color="#6366f1" />
                        </View>
                        <ThemedText style={styles.runtimeLabel}>
                            {t('machine_runtime') || 'Machine Runtime'}
                        </ThemedText>
                    </View>

                    <View style={styles.timeDisplay}>
                        {/* Hours */}
                        <View style={styles.timeBlock}>
                            <View style={[styles.timeValueBox, { backgroundColor: subtleBg }]}>
                                <ThemedText style={[styles.timeValue, { color: '#6366f1' }]}>
                                    {String(hours).padStart(2, '0')}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.timeUnit}>
                                {t('hours') || 'HOURS'}
                            </ThemedText>
                        </View>

                        {/* Separator */}
                        <ThemedText style={[styles.timeSeparator, { color: '#6366f1' }]}>:</ThemedText>

                        {/* Minutes */}
                        <View style={styles.timeBlock}>
                            <View style={[styles.timeValueBox, { backgroundColor: subtleBg }]}>
                                <ThemedText style={[styles.timeValue, { color: '#6366f1' }]}>
                                    {String(minutes).padStart(2, '0')}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.timeUnit}>
                                {t('minutes') || 'MINUTES'}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Status Info */}
                <View style={[styles.infoCard, { backgroundColor: subtleBg }]}>
                    <View style={[styles.infoRow]}>
                        <ThemedText style={styles.infoLabel}>
                            {t('connection_status') || 'Connection'}
                        </ThemedText>
                        <ThemedText style={[styles.infoValue, { color: isConnected ? '#10b981' : '#ef4444' }]}>
                            {isConnected ? (t('online') || 'Online') : (t('offline') || 'Offline')}
                        </ThemedText>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.infoLabel}>
                            {t('device') || 'Device'}
                        </ThemedText>
                        <ThemedText style={styles.infoValue} numberOfLines={1}>
                            {device || '--'}
                        </ThemedText>
                    </View>
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
                    activeOpacity={0.7}
                >
                    <RotateCcw size={18} color="#ffffff" />
                    <ThemedText style={styles.resetButtonText}>
                        {t('reset_operating_hours') || 'Reset Operating Hours'}
                    </ThemedText>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    runtimeCard: {
        borderRadius: 24,
        padding: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    runtimeIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 28,
    },
    runtimeIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    runtimeLabel: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.8,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    timeBlock: {
        alignItems: 'center',
        gap: 8,
    },
    timeValueBox: {
        width: 120,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeValue: {
        fontSize: 40,
        fontWeight: '900',
    },
    timeUnit: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        opacity: 0.5,
        textTransform: 'uppercase',
    },
    timeSeparator: {
        fontSize: 40,
        fontWeight: '900',
        marginBottom: 20,
    },
    infoCard: {
        borderRadius: 20,
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    infoDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.06)',
        marginVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        maxWidth: '60%',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    resetButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
    },
});
