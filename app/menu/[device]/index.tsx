import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AnimatedIcon from '@/components/ui/animated-icon';
import { STAGGER_DELAY } from '@/constants/animation-config';
import { useI18n } from '@/i18n';
import { useAuth } from '@/providers/auth';
import { useThemeMode } from '@/providers/theme';
import { mediumHaptic } from '@/utils/haptic-utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowRight,
    Clock,
    Factory,
    Gauge,
    Power,
    Settings,
    Wind,
    Zap,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface MenuItem {
    icon: React.ComponentType<{ size: number; color: string }>;
    title: string;
    path: string;
    gradientColors: [string, string, string];
    iconColor: string;
}

// Grain/Paddy device names
const grainPaddyDevices = [
    'GTPL-132-300-AP-S7-1200',
    'GTPL-136-gT-450AP',
    'GTPL-139-GT-300AP-S7-1200',
    'GTPL-142-gT-450AP-S7-1200',
    'GTPL-143-gT-450AP-S7-1200',
        "GTPL-123-GT-450AP"
];

// Devices that should hide aeration
const hideAerationDevices = ['GTPL-061-gT-450T-S7-1200'];

export default function DeviceMenuScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const { monitorAccess } = useAuth();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ device: string; deviceData: string; status: string }>();

    const deviceName = params.device;

    const isGrainPaddyDevice = grainPaddyDevices.includes(deviceName || '');
    const shouldHideAeration = hideAerationDevices.includes(deviceName || '');

    const getMenuItems = (): MenuItem[] => {
        if (isGrainPaddyDevice) {
            return [
                {
                    icon: Factory,
                    title: 'Grain Chilling Mode',
                    path: 'auto-grain',
                    gradientColors: ['#10b981', '#14b8a6', '#059669'],
                    iconColor: '#10b981',
                },
                {
                    icon: Gauge,
                    title: 'Paddy Ageing Mode',
                    path: 'auto-paddy',
                    gradientColors: ['#f59e0b', '#eab308', '#ea580c'],
                    iconColor: '#f59e0b',
                },
                {
                    icon: Wind,
                    title: t('aeration') || 'Aeration',
                    path: 'aerations',
                    gradientColors: ['#0ea5e9', '#06b6d4', '#2563eb'],
                    iconColor: '#0ea5e9',
                },
                {
                    icon: AlertTriangle,
                    title: t('fault') || 'Fault',
                    path: 'fault',
                    gradientColors: ['#ef4444', '#f97316', '#f43f5e'],
                    iconColor: '#ef4444',
                },
                {
                    icon: Clock,
                    title: t('operating_hours') || 'Operating Hours',
                    path: 'operating-hours',
                    gradientColors: ['#6366f1', '#8b5cf6', '#a855f7'],
                    iconColor: '#6366f1',
                },
                {
                    icon: Power,
                    title: t('inputs') || 'Inputs',
                    path: 'inputs',
                    gradientColors: ['#8b5cf6', '#6366f1', '#a855f7'],
                    iconColor: '#8b5cf6',
                },
                {
                    icon: Zap,
                    title: t('outputs') || 'Outputs',
                    path: 'outputs',
                    gradientColors: ['#d946ef', '#ec4899', '#f43f5e'],
                    iconColor: '#d946ef',
                },
            ];
        } else {
            const baseItems: MenuItem[] = [
                {
                    icon: Gauge,
                    title: t('auto') || 'Auto',
                    path: 'auto',
                    gradientColors: ['#6366f1', '#3b82f6', '#a855f7'],
                    iconColor: '#6366f1',
                },
                {
                    icon: Wind,
                    title: t('aeration') || 'Aeration',
                    path: 'aerations',
                    gradientColors: ['#0ea5e9', '#06b6d4', '#2563eb'],
                    iconColor: '#0ea5e9',
                },
                {
                    icon: AlertTriangle,
                    title: t('fault') || 'Fault',
                    path: 'fault',
                    gradientColors: ['#ef4444', '#f97316', '#f43f5e'],
                    iconColor: '#ef4444',
                },
                {
                    icon: Clock,
                    title: t('operating_hours') || 'Operating Hours',
                    path: 'operating-hours',
                    gradientColors: ['#6366f1', '#8b5cf6', '#a855f7'],
                    iconColor: '#6366f1',
                },
                {
                    icon: Power,
                    title: t('inputs') || 'Inputs',
                    path: 'inputs',
                    gradientColors: ['#8b5cf6', '#6366f1', '#a855f7'],
                    iconColor: '#8b5cf6',
                },
                {
                    icon: Zap,
                    title: t('outputs') || 'Outputs',
                    path: 'outputs',
                    gradientColors: ['#d946ef', '#ec4899', '#f43f5e'],
                    iconColor: '#d946ef',
                },
                // {
                //     icon: Construction,
                //     title: t('test') || 'Test',
                //     path: 'test',
                //     gradientColors: ['#06b6d4', '#3b82f6', '#6366f1'],
                //     iconColor: '#06b6d4',
                // },
            ];

            if (shouldHideAeration) {
                return baseItems.filter((item) => item.path !== 'aerations');
            }

            return baseItems;
        }
    };

    const allMenuItems = getMenuItems();
    // Filter out menu items blacklisted in monitorAccess (match path or title)
    const menuItems = monitorAccess.length > 0
        ? allMenuItems.filter((item) => {
            const pathMatch = monitorAccess.includes(item.path.toLowerCase());
            const titleMatch = monitorAccess.includes(item.title.toLowerCase());
            return !pathMatch && !titleMatch;
        })
        : allMenuItems;
    const [itemAnims] = useState(() => menuItems.map(() => new Animated.Value(0)));

    useEffect(() => {
        const animations = itemAnims.map((anim, index) => {
            return Animated.timing(anim, {
                toValue: 1,
                duration: 400,
                delay: index * STAGGER_DELAY.medium,
                useNativeDriver: true,
            });
        });

        Animated.parallel(animations).start();
    }, []);

    const handleMenuItemPress = (item: MenuItem) => {
        mediumHaptic();
        router.push(`/menu/${deviceName}/${item.path}`);
    };

    const renderMenuItem = (item: MenuItem, index: number) => {
        const Icon = item.icon;
        const anim = itemAnims[index] || new Animated.Value(1);

        return (
            <Animated.View
                key={item.path}
                style={[
                    styles.menuItemWrapper,
                    {
                        opacity: anim,
                        transform: [
                            {
                                translateY: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.menuItem,
                        {
                            backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                            borderColor: effective === 'dark' ? '#334155' : '#e2e8f0',
                        },
                    ]}
                    onPress={() => handleMenuItemPress(item)}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: item.iconColor + '15' },
                            ]}
                        >
                            <AnimatedIcon animationType="pulse" duration={2000}>
                                <Icon size={28} color={item.iconColor} />
                            </AnimatedIcon>
                        </View>
                        <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
                        <View style={styles.arrowContainer}>
                            <ArrowRight
                                size={16}
                                color={effective === 'dark' ? '#64748b' : '#94a3b8'}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 24 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.title}>MENU</ThemedText>
                    <ThemedText
                        style={[
                            styles.deviceName,
                            { color: effective === 'dark' ? '#60a5fa' : '#2563eb' },
                        ]}
                        numberOfLines={2}
                    >
                        {deviceName}
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Select an option to continue
                    </ThemedText>
                </View>

                {/* Menu Grid */}
                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => renderMenuItem(item, index))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuItemWrapper: {
        width: CARD_WIDTH,
        marginBottom: 16,
    },
    menuItem: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    menuItemContent: {
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuItemTitle: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 20,
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
