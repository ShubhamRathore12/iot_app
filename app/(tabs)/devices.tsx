import AnimatedButton from '@/components/ui/animated-button';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedText from '@/components/ui/animated-text';
import { useMachineStatus } from '@/providers/machine-status';
import { useI18n } from '@/i18n';
import { useAuth } from '@/providers/auth';
import { useThemeTokens } from '@/providers/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Cpu,
  Download,
  Filter,
  MapPin,
  Snowflake,
  Wifi,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from '@/constants/animation-config';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type MachineType = 'chiller' | 'dryer' | 'conveyor' | 'silo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Device {
  id: string;
  name: string;
  location: string;
  image: string;
  type: MachineType;
  status: 'active' | 'inactive' | 'maintenance';
  internetStatus: boolean;
  coolingStatus: boolean;
  chillerModel?: string;
  plc: string;
  model: string;
}

const allDevices: Device[] = [
  { id: '1', name: 'GTPL-30-gT-180E-S7-1200', type: 'chiller', model: 'gT-140E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-140E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '2', name: 'GTPL-061-gT-450T-S7-1200', type: 'chiller', model: 'gT-450T', location: 'Turkey', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450T', status: 'active', internetStatus: true, coolingStatus: false },
  { id: '3', name: 'GTPL-108-gT-40E-P-S7-200', type: 'chiller', model: 'gT-40E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-40E-P', status: 'inactive', internetStatus: false, coolingStatus: false },
  { id: '4', name: 'GTPL-109-gT-40E-P-S7-200', type: 'chiller', model: 'gT-40E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-40E-P', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '5', name: 'GTPL-110-gT-40E-P-S7-200', type: 'chiller', model: 'gT-40E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-40E-P', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '6', name: 'GTPL-111-gT-80E-P-S7-200', type: 'chiller', model: 'gT-80E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-80E-P', status: 'inactive', internetStatus: false, coolingStatus: false },
  { id: '7', name: 'GTPL-112-gT-80E-P-S7-200', type: 'chiller', model: 'gT-80E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-80E-P', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '8', name: 'GTPL-113-gT-80E-P-S7-200', type: 'chiller', model: 'gT-80E-P', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-80E-P', status: 'active', internetStatus: true, coolingStatus: false },
  { id: '9', name: 'GTPL-115-gT-180E-S7-1200', type: 'chiller', model: 'gT-180E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-180E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '10', name: 'GTPL-116-gT-240E-S7-1200', type: 'chiller', model: 'gT-240E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-240E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '11', name: 'GTPL-117-gT-320E-S7-1200', type: 'chiller', model: 'gT-320E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-320E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '12', name: 'GTPL-118-gT-60T-S7-200', type: 'chiller', model: 'gT-80E-P', location: 'Telangana', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-200', chillerModel: 'gT-80E-P', status: 'active', internetStatus: true, coolingStatus: false },
  { id: '13', name: 'GTPL-119-gT-180E-S7-1200', type: 'chiller', model: 'gT-180E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-180E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '14', name: 'GTPL-120-gT-180E-S7-1200', type: 'chiller', model: 'gT-180E', location: 'Germany', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-180E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '15', name: 'GTPL-121-gT-1000T-S7-1200', type: 'chiller', model: 'gT-1000T', location: 'kanpur', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-1000T', status: 'active', internetStatus: true, coolingStatus: false },
  { id: '16', name: 'GTPL-122-gT-1000T-S7-1200', type: 'chiller', model: 'gT-1000T', location: 'kanpur', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-1000T', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '17', name: 'GTPL-124-GT-450T-S7-1200', type: 'chiller', model: 'gT-240E', location: 'Indonesia', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-240E', status: 'active', internetStatus: false, coolingStatus: true },
  { id: '18', name: 'GTPL-133-GT-650T-S7-1200', type: 'chiller', model: 'GT-650T', location: 'Vietnam', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'GT-650T', status: 'inactive', internetStatus: false, coolingStatus: false },
  { id: '19', name: 'GTPL-132-300-AP-S7-1200', type: 'chiller', model: 'gT-240E', location: 'Salem (Tamil Nadu)', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-240E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '20', name: 'GTPL-134-gT-450T-S7-1200', type: 'chiller', model: 'gT-450T', location: 'Kakinada (AP)', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450T', status: 'active', internetStatus: true, coolingStatus: false },
  { id: '21', name: 'GTPL-135-gT-450T-S7-1200', type: 'chiller', model: 'gT-450T', location: 'Bihar', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450T', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '22', name: 'GTPL-136-gT-450AP', type: 'chiller', model: 'gT-450AP', location: 'Srilanka', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450AP', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '23', name: 'GTPL-137-GT-450T-S7-1200', type: 'chiller', model: 'gT-240E', location: 'Thailand', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-240E', status: 'active', internetStatus: false, coolingStatus: false },
  { id: '24', name: 'GTPL-138-GT-450T-S7-1200', type: 'chiller', model: 'gT-240E', location: 'Thailand', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-240E', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '25', name: 'GTPL-139-GT-300AP-S7-1200', type: 'chiller', model: 'GT-300AP', location: 'Pondicherry', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'GT-300AP', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '26', name: 'GTPL-142-gT-450AP-S7-1200', type: 'chiller', model: 'gT-450AP', location: 'A.P.', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450AP', status: 'inactive', internetStatus: false, coolingStatus: false },
  { id: '27', name: 'GTPL-143-gT-450AP-S7-1200', type: 'chiller', model: 'gT-450AP', location: 'A.P.', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450AP', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '28', name: 'GTPL-123-GT-450AP', type: 'chiller', model: 'GT-450AP', location: 'Raichur, Karnataka', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'GT-450AP', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '29', name: 'GTPL-145-GT-450T-S7-1200', type: 'chiller', model: 'gT-450T', location: 'Tamil Nadu', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450T', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '30', name: 'GTPL-148-GT-450T-S7-1200', type: 'chiller', model: 'gT-450T', location: 'Kakinada, Andhra Pradesh', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'gT-450T', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '31', name: 'GTPL-131-GT-650T-S7-1200', type: 'chiller', model: 'GT-650T', location: 'Ganganagar, Rajasthan', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'GT-650T', status: 'active', internetStatus: true, coolingStatus: true },
  { id: '32', name: 'GTPL-144-GT-300AP-S7-1200', type: 'chiller', model: 'GT-300AP', location: 'Tamil Nadu', image: 'https://imgtolinkx.com/i/tyDruPH0', plc: 'S7-1200', chillerModel: 'GT-300AP', status: 'active', internetStatus: true, coolingStatus: true },
];

// locations are now computed dynamically inside the component based on monitorAccess

const deviceNameToStatusKey: Record<string, string> = {
  'GTPL-122-gT-1000T-S7-1200': 'GTPL_122_S7_1200',
  'GTPL-118-gT-60T-S7-200': 'KABO_200',
  'GTPL-108-gT-40E-P-S7-200': 'GTPL_108',
  'GTPL-109-gT-40E-P-S7-200': 'GTPL_109',
  'GTPL-110-gT-40E-P-S7-200': 'GTPL_110',
  'GTPL-111-gT-80E-P-S7-200': 'GTPL_111',
  'GTPL-112-gT-80E-P-S7-200': 'GTPL_112',
  'GTPL-113-gT-80E-P-S7-200': 'GTPL_113',
  'GTPL-30-gT-180E-S7-1200': 'GTPL_114',
  'GTPL-115-gT-180E-S7-1200': 'GTPL_115',
  'GTPL-116-gT-240E-S7-1200': 'GTPL_116',
  'GTPL-117-gT-320E-S7-1200': 'GTPL_117',
  'GTPL-119-gT-180E-S7-1200': 'GTPL_119',
  'GTPL-120-gT-180E-S7-1200': 'GTPL_120',
  'GTPL-121-gT-1000T-S7-1200': 'GTPL_121',
  'GTPL-124-GT-450T-S7-1200': 'GTPL_124',
  'GTPL-133-GT-650T-S7-1200': 'GTPL_133',
  'GTPL-131-GT-650T-S7-1200': 'GTPL_131',
  'GTPL-132-300-AP-S7-1200': 'GTPL_132',
  'GTPL-136-gT-450AP': 'GTPL_136',
  'GTPL-137-GT-450T-S7-1200': 'GTPL_137',
  'GTPL-138-GT-450T-S7-1200': 'GTPL_138',
  'GTPL-134-gT-450T-S7-1200': 'GTPL_134',
  'GTPL-135-gT-450T-S7-1200': 'GTPL_135',
  'GTPL-061-gT-450T-S7-1200': 'GTPL_061',
  'GTPL-139-GT-300AP-S7-1200': 'GTPL_139',
  'GTPL-142-gT-450AP-S7-1200': 'GTPL_142',
  'GTPL-143-gT-450AP-S7-1200': 'GTPL_143',
  'GTPL-123-GT-450AP': 'GTPL_123',
  'GTPL-145-GT-450T-S7-1200': 'GTPL_145',
  'GTPL-148-GT-450T-S7-1200': 'GTPL_148',
  'GTPL-144-GT-300AP-S7-1200': 'GTPL_144',
};

// ─── Pulsing Status Dot ──────────────────────────────────────────────
function PulsingDot({ active, tokens }: { active: boolean; tokens: ReturnType<typeof useThemeTokens> }) {
  const dotColor = active ? tokens.colors.success : tokens.colors.error;
  return (
    <View style={[styles.pulsingDot, { backgroundColor: dotColor + '30' }]}>
      <View style={[styles.pulsingDotInner, { backgroundColor: dotColor }]} />
    </View>
  );
}

// ─── Filter Chip ─────────────────────────────────────────────────────
function FilterChip({
  label,
  selected,
  onPress,
  tokens,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  tokens: ReturnType<typeof useThemeTokens>;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.93, SPRING_CONFIG.stiff); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG.default); }}
      style={[
        styles.filterChip,
        {
          backgroundColor: selected ? tokens.colors.accent : tokens.colors.surface,
          borderColor: selected ? tokens.colors.accent : tokens.colors.border,
        },
        animStyle,
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: selected ? '#fff' : tokens.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

// ─── Status Icon Row ─────────────────────────────────────────────────
function StatusIconRow({ device, tokens }: { device: Device; tokens: ReturnType<typeof useThemeTokens> }) {
  const items = [
    { icon: Cpu, active: device.status === 'active', label: 'Machine' },
    { icon: Wifi, active: device.internetStatus, label: 'Internet' },
    { icon: Snowflake, active: device.coolingStatus, label: 'Cooling' },
  ];

  return (
    <View style={[styles.statusGrid, { backgroundColor: tokens.colors.background }]}>
      {items.map(({ icon: Icon, active, label }) => (
        <View key={label} style={styles.statusItem}>
          <Icon size={18} color={active ? tokens.colors.success : tokens.colors.textSecondary + '60'} />
          <Text style={[styles.statusLabel, { color: tokens.colors.textSecondary }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Device Card ─────────────────────────────────────────────────────
const DeviceCard = React.memo(function DeviceCard({
  item,
  index,
  tokens,
  onViewMore,
}: {
  item: Device;
  index: number;
  tokens: ReturnType<typeof useThemeTokens>;
  onViewMore: (name: string) => void;
}) {
  const isActive = item.status === 'active';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(18)}
      layout={LinearTransition.springify().damping(20)}
    >
      <AnimatedCard animated={true} initialScale={0.95} style={{ width: CARD_WIDTH, margin: 0, marginBottom: 0 }}>
        <View style={styles.deviceContent}>
          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: (isActive ? tokens.colors.success : tokens.colors.error) + '20' },
              ]}
            >
              <PulsingDot active={isActive} tokens={tokens} />
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? tokens.colors.success : tokens.colors.error },
                ]}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {/* Device Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.deviceImage} resizeMode="cover" />
            <View style={[styles.imageOverlay, { backgroundColor: tokens.colors.overlay }]} />
          </View>

          <View style={styles.cardContent}>
            <AnimatedText style={styles.deviceName} numberOfLines={2} type="body">
              {item.name}
            </AnimatedText>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MapPin size={14} color={tokens.colors.accent} />
                <Text style={[styles.infoText, { color: tokens.colors.textSecondary }]}>{item.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="office-building" size={14} color={tokens.colors.accent} />
                <Text style={[styles.infoText, { color: tokens.colors.textSecondary }]}>Grain Technik</Text>
              </View>
            </View>

            <StatusIconRow device={item} tokens={tokens} />

            <View style={styles.actionButtons}>
              <AnimatedButton
                title="View More"
                onPress={() => onViewMore(item.name)}
                variant="primary"
                size="small"
                style={{ flex: 1 }}
              />
              <AnimatedButton title="" onPress={() => {}} variant="secondary" size="small">
                <Download size={16} color={tokens.colors.text} />
              </AnimatedButton>
            </View>
          </View>
        </View>
      </AnimatedCard>
    </Animated.View>
  );
});

// ─── Main Screen ─────────────────────────────────────────────────────
export default function DevicesScreen() {
  const router = useRouter();
  const tokens = useThemeTokens();
  const { t } = useI18n();
  const { monitorAccess } = useAuth();

  const { status: machineStatus, error: statusError, refresh: refreshStatus } = useMachineStatus();
  const [statusLoading, setStatusLoading] = useState(true);
  const deviceStatuses = machineStatus?.machines || [];
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Derive locations from whitelisted devices only
  const accessibleDevices = useMemo(() => {
    if (monitorAccess.length === 0) return allDevices;
    const accessLower = monitorAccess.map((a) => a.toLowerCase());
    return allDevices.filter((d) => accessLower.includes(d.name.toLowerCase()));
  }, [monitorAccess]);
  const locations = useMemo(() => {
    return ['All', ...[...new Set(accessibleDevices.map((d) => d.location))].sort()];
  }, [accessibleDevices]);

  useEffect(() => {
    if (deviceStatuses.length > 0) setStatusLoading(false);
  }, [deviceStatuses.length]);

  const getDeviceStatus = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    if (!key) return { machineStatus: false, internetStatus: false, coolingStatus: false, hasNewData: false };
    const ds = deviceStatuses.find((m: any) => m.machineName === key);
    return {
      machineStatus: ds?.machineStatus ?? false,
      internetStatus: ds?.internetStatus ?? false,
      coolingStatus: ds?.coolingStatus ?? false,
      hasNewData: ds?.hasNewData ?? false,
    };
  };

  const devicesWithStatus = useMemo(() => {
    return allDevices.map((device) => {
      const ds = getDeviceStatus(device.name);
      return {
        ...device,
        status: (ds.machineStatus ? 'active' : device.status === 'maintenance' ? 'maintenance' : 'inactive') as Device['status'],
        internetStatus: ds.internetStatus,
        coolingStatus: ds.coolingStatus,
      };
    });
  }, [deviceStatuses]);

  const filteredDevices = useMemo(() => {
    // Whitelist: only show devices listed in monitorAccess (if empty, show all)
    let devices = devicesWithStatus;
    if (monitorAccess.length > 0) {
      const accessLower = monitorAccess.map((a) => a.toLowerCase());
      devices = devices.filter(
        (d) => accessLower.includes(d.name.toLowerCase())
      );
    }
    if (selectedLocation === 'All') return devices;
    return devices.filter((d) => d.location === selectedLocation);
  }, [devicesWithStatus, selectedLocation, monitorAccess]);

  const handleViewMore = React.useCallback(
    (deviceName: string) => {
      const ds = getDeviceStatus(deviceName);
      router.push({
        pathname: '/menu/[device]',
        params: {
          device: deviceName,
          status: encodeURIComponent(JSON.stringify(ds)),
        },
      });
    },
    [router, deviceStatuses]
  );

  const renderDeviceCard = React.useCallback(
    ({ item, index }: { item: Device; index: number }) => (
      <DeviceCard item={item} index={index} tokens={tokens} onViewMore={handleViewMore} />
    ),
    [tokens, handleViewMore]
  );

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View>
          <Text style={[styles.title, { color: tokens.colors.text }]}>{t('devices') || 'Devices'}</Text>
          <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
            Connected machines and equipment
          </Text>
        </View>
        <FilterButton tokens={tokens} active={showFilters} onPress={() => setShowFilters(!showFilters)} />
      </Animated.View>

      {/* Filters */}
      {showFilters && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.filtersContainer,
            {
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
              ...(tokens.elevation.low as any),
            },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
            {locations.map((loc) => (
              <FilterChip
                key={loc}
                label={loc}
                selected={selectedLocation === loc}
                onPress={() => {
                  setSelectedLocation(loc);
                  setShowFilters(false);
                }}
                tokens={tokens}
              />
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Loading */}
      {statusLoading && (
        <Animated.View entering={FadeIn} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.accent} />
          <Text style={[styles.loadingText, { color: tokens.colors.textSecondary }]}>Loading device status...</Text>
        </Animated.View>
      )}

      {/* Error */}
      {statusError && (
        <Animated.View entering={FadeIn} style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: tokens.colors.error }]}>Error: {statusError}</Text>
          <Pressable
            style={[styles.retryButton, { backgroundColor: tokens.colors.accent }]}
            onPress={refreshStatus}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Device Grid */}
      <FlatList
        data={filteredDevices}
        renderItem={renderDeviceCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshStatus}
            colors={[tokens.colors.accent]}
            tintColor={tokens.colors.accent}
          />
        }
      />
    </View>
  );
}

// ─── Filter Button ───────────────────────────────────────────────────
function FilterButton({
  tokens,
  active,
  onPress,
}: {
  tokens: ReturnType<typeof useThemeTokens>;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.92, SPRING_CONFIG.stiff); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG.default); }}
      style={[
        styles.filterButton,
        {
          backgroundColor: active ? tokens.colors.accent + '15' : tokens.colors.surface,
          borderColor: active ? tokens.colors.accent : tokens.colors.border,
        },
        animStyle,
      ]}
    >
      {active ? (
        <X size={18} color={tokens.colors.accent} />
      ) : (
        <Filter size={18} color={tokens.colors.accent} />
      )}
      <Text style={[styles.filterText, { color: active ? tokens.colors.accent : tokens.colors.text }]}>
        {active ? 'Close' : 'Filter'}
      </Text>
    </AnimatedPressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deviceContent: {
    flex: 1,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  imageContainer: {
    height: 130,
    position: 'relative',
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  cardContent: {
    padding: 14,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 18,
  },
  infoContainer: {
    gap: 6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 11,
    flex: 1,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  statusItem: {
    alignItems: 'center',
    gap: 2,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
