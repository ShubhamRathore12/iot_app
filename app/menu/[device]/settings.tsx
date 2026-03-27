import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Database,
    FileText,
    Percent,
    Settings as SettingsIcon,
    Shield
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SettingItem {
    id: string;
    title: string;
    description: string;
    icon: any;
    path: string;
    color: string;
}

const SETTINGS_MENU: SettingItem[] = [
    {
        id: 'pid',
        title: 'PID Settings',
        description: 'Configure control loops and gains',
        icon: Percent,
        path: 'pid',
        color: '#3b82f6'
    },
    {
        id: 'datetime',
        title: 'Date & Time',
        description: 'System clock and scheduler',
        icon: Clock,
        path: 'date-time',
        color: '#10b981'
    },
    {
        id: 'datalog',
        title: 'Data Log',
        description: 'Logging intervals and history',
        icon: Database,
        path: 'data-log',
        color: '#f59e0b'
    },
    {
        id: 'operating',
        title: 'Operating Hours',
        description: 'Machine runtime and service intervals',
        icon: FileText,
        path: 'operating-hours',
        color: '#6366f1'
    },
    {
        id: 'defaults',
        title: 'Factory Defaults',
        description: 'Reset configuration values',
        icon: SettingsIcon,
        path: 'defaults',
        color: '#ef4444'
    }
];

export default function SettingsScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    // We don't necessarily need live data for the menu itself, 
    // but it's good to keep consistent with other screens.
    const { isConnected } = useAutoData(device || '');

    const handleBack = () => router.back();

    const handleSettingPress = (item: SettingItem) => {
        // Navigate to specific settings sub-pages
        // Since we are implementing core screens, we can add placeholders for these
        // router.push(`/menu/${device}/settings/${item.path}`);
    };

    const renderSettingItem = (item: SettingItem, index: number) => (
        <TouchableOpacity
            key={item.id}
            style={[
                styles.settingCard,
                { backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff' }
            ]}
            onPress={() => handleSettingPress(item)}
        >
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={24} color={item.color} />
            </View>

            <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.settingDescription}>{item.description}</ThemedText>
            </View>

            <ChevronRight size={20} color="#64748b" />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerTitle}>DEVICE SETTINGS</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device} • Configuration</ThemedText>
                </View>
                <View style={[styles.statusIndicator, { borderColor: isConnected ? '#10b981' : '#ef4444' }]}>
                    <ThemedText style={[styles.statusIndicatorText, { color: isConnected ? '#10b981' : '#ef4444' }]}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </ThemedText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Shield size={16} color="#64748b" />
                    <ThemedText style={styles.sectionHeaderText}>SYSTEM CONFIGURATION</ThemedText>
                </View>

                {SETTINGS_MENU.map((item, index) => renderSettingItem(item, index))}

                <View style={[styles.infoCard, { backgroundColor: effective === 'dark' ? '#334155' : '#f1f5f9' }]}>
                    <Database size={20} color="#64748b" />
                    <View style={styles.infoTextContainer}>
                        <ThemedText style={styles.infoTitle}>Cloud Synchronization</ThemedText>
                        <ThemedText style={styles.infoDescription}>
                            All changes are automatically synced to the central monitoring server.
                        </ThemedText>
                    </View>
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
    statusIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    statusIndicatorText: {
        fontSize: 10,
        fontWeight: '900',
    },
    scrollContent: {
        padding: 20,
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        marginTop: 10,
    },
    sectionHeaderText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748b',
        letterSpacing: 1,
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.01)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        opacity: 0.5,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginTop: 20,
        gap: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 12,
        lineHeight: 18,
        opacity: 0.6,
    },
});
