import LoadingScreen from '@/components/loading-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BAR_PRESSURE_DEVICES,
  CR_VALVE_DEVICES,
  CR_VALVES,
  getControlColor,
  getPaddyHMIConfig,
  getSetPointColor,
  getTempColor,
  HMI_COLORS,
  resolveCRValue,
} from '@/constants/hmi-config';
import { useAutoData } from '@/hooks/use-auto-data';
import { useThemeTokens } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Activity,
  ChevronLeft,
  Fan,
  Gauge,
  Thermometer,
  Zap,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

// ─── Icon Helpers ────────────────────────────────────────────────────────────

const getControlIcon = (key: string) =>
  key === 'BLOWER' || key === 'COND' || key === 'CONDENSORFANSPEED' ? Fan : Zap;

// ─── Animated Status Dot ─────────────────────────────────────────────────────

function PulsingDot({ color }: { color: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color,
    opacity: opacity.value,
    marginRight: 6,
  }));

  return <Animated.View style={style} />;
}

// ─── Data Card (Reanimated) ──────────────────────────────────────────────────

interface DataCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  index: number;
  fullWidth?: boolean;
}

function DataCard({ label, value, icon: Icon, color, index, fullWidth }: DataCardProps) {
  const tokens = useThemeTokens();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, []);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, []);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(18)}
      layout={LinearTransition.springify()}
      style={[animatedScale, { width: fullWidth ? width - 40 : CARD_WIDTH }]}
    >
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
              ...tokens.elevation.low,
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
            <Icon size={20} color={color} />
          </View>
          <View style={styles.cardInfo}>
            <ThemedText style={[styles.cardLabel, { color: tokens.colors.textSecondary }]}>
              {label}
            </ThemedText>
            <ThemedText style={[styles.cardValue, { color }]}>{value}</ThemedText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── CR Valve Status Card ────────────────────────────────────────────────────

function CRValveCard({
  label,
  isOn,
  index,
}: {
  label: string;
  isOn: boolean;
  index: number;
}) {
  const tokens = useThemeTokens();
  const statusColor = isOn ? HMI_COLORS.statusOn : HMI_COLORS.statusOff;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60 + 400).springify().damping(18)}
      style={{ width: CARD_WIDTH }}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.border,
            ...tokens.elevation.low,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${HMI_COLORS.crValve}18` }]}>
          <Zap size={20} color={HMI_COLORS.crValve} />
        </View>
        <View style={styles.cardInfo}>
          <ThemedText style={[styles.cardLabel, { color: tokens.colors.textSecondary }]}>
            {label}
          </ThemedText>
          <ThemedText style={[styles.cardValue, { color: statusColor }]}>
            {isOn ? 'ON' : 'OFF'}
          </ThemedText>
        </View>
        <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
      </View>
    </Animated.View>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ title, index }: { title: string; index: number }) {
  const tokens = useThemeTokens();
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(400)}
      style={styles.sectionHeader}
    >
      <View style={[styles.sectionLine, { backgroundColor: tokens.colors.accent }]} />
      <ThemedText style={[styles.sectionTitle, { color: tokens.colors.textSecondary }]}>
        {title}
      </ThemedText>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AutoPaddyScreen() {
  const router = useRouter();
  const tokens = useThemeTokens();
  const insets = useSafeAreaInsets();
  const { device } = useLocalSearchParams<{ device: string }>();

  const { data, isConnected, error, formatValue } = useAutoData(device || '');

  const config = useMemo(() => getPaddyHMIConfig(device || ''), [device]);
  const hasCRValves = useMemo(
    () => CR_VALVE_DEVICES.includes(device || ''),
    [device],
  );
  const isBarMachine = useMemo(
    () => BAR_PRESSURE_DEVICES.includes(device || ''),
    [device],
  );
  const pressureUnit = isBarMachine ? 'bar' : 'psi';

  // Check if paddy ageing mode is active (handles both backend spellings)
  const isPaddyAgeingMode = (() => {
    const value = data?.Paddy_aeging_mode ?? data?.Paddy_ageing_mode;
    if (value === true || value === 1 || value === '1') return true;
    if (String(value)?.toLowerCase() === 'true') return true;
    return false;
  })();

  // ── Data Accessors ───────────────────────────────────────────────────────

  const getValueByKey = useCallback(
    (key: string) => (data?.[key] !== undefined ? data[key] : '--'),
    [data],
  );

  const getT1T0Value = useCallback(() => {
    if (!data) return '--';
    if (device?.includes('GTPL-061')) {
      return data.T1_set_point || data.T1_temp_mean || data.COLD_AIR_TEMP_T1 || '--';
    }
    // Paddy mode - use paddy-specific setpoints
    return (
      data.T0_set_point ||
      data.AIR_OUTLET_TEMP ||
      data.T1_set_point_in_paddy_aeging_mode ||
      data.T0_set_point_in_paddy_aeging_mode ||
      data.T0_temp_mean ||
      '--'
    );
  }, [data, device]);

  const getTDeltaValue = useCallback(() => {
    if (!data) return '--';
    if (device?.includes('GTPL-061')) {
      return data.T0_T1_set_point || data.AIR_OUTLET_TEMP || data.T1_temp_mean || '--';
    }
    // Paddy mode - use paddy-specific delta values
    return (
      data.Delta_T_set_point ||
      data.Th_T1 ||
      data.Delta_T_set_point_paddy_aeging_mode ||
      '--'
    );
  }, [data, device]);

  const t1t0Label = device?.includes('GTPL-061') ? 'T1 Set Point' : 'T0';
  const tDeltaLabel = device?.includes('GTPL-061') ? 'T0 - T1' : 'T Delta';

  // ── Build Card Data ──────────────────────────────────────────────────────

  const temperatureCards = useMemo(() => {
    const t1t0Value = getT1T0Value();
    return [
      {
        key: 'setpoint',
        label: `${t1t0Label} (SET POINT)`,
        value: formatValue(t1t0Value, '°C'),
        icon: Thermometer,
        color: getSetPointColor(t1t0Value),
      },
      {
        key: 'delta',
        label: tDeltaLabel,
        value: formatValue(getTDeltaValue(), '°C'),
        icon: Thermometer,
        color: getTempColor('T1'),
      },
      ...Object.entries(config.temperatureSensors).map(([sensorKey, sensor]) => ({
        key: `temp-${sensorKey}`,
        label: sensor.label,
        value: formatValue(getValueByKey(sensor.key), '°C'),
        icon: Thermometer,
        color: getTempColor(sensorKey),
      })),
    ];
  }, [data, config, getT1T0Value, getTDeltaValue, getValueByKey, formatValue]);

  const controlCards = useMemo(
    () =>
      Object.entries(config.controls).map(([controlKey, control]) => ({
        key: `ctrl-${controlKey}`,
        label: control.label,
        value: formatValue(data?.[control.key], '%'),
        icon: getControlIcon(controlKey),
        color: getControlColor(controlKey),
      })),
    [data, config, formatValue],
  );

  const crValveCards = useMemo(() => {
    if (!hasCRValves) return [];
    return CR_VALVES.map((valve) => {
      const resolved = resolveCRValue(data, valve);
      return {
        ...valve,
        isOn: resolved?.toLowerCase() === 'true',
      };
    });
  }, [data, hasCRValves]);

  // ── Status Badge ─────────────────────────────────────────────────────────

  const statusBadgeColor = !isConnected
    ? tokens.colors.error
    : isPaddyAgeingMode
      ? tokens.colors.success
      : tokens.colors.warning;

  const statusLabel = !isConnected
    ? 'OFFLINE'
    : isPaddyAgeingMode
      ? 'ACTIVE'
      : 'ONLINE';

  // ── Loading ──────────────────────────────────────────────────────────────

  if (!data) return <LoadingScreen />;

  // ── Render ───────────────────────────────────────────────────────────────

  const compressorStartIndex = temperatureCards.length + controlCards.length;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: tokens.colors.background,
            borderBottomColor: tokens.colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: `${tokens.colors.text}08` }]}
        >
          <ChevronLeft size={22} color={tokens.colors.text} />
        </Pressable>

        <View style={styles.headerInfo}>
          <ThemedText style={styles.headerTitle}>PADDY AGEING</ThemedText>
          <ThemedText
            style={[styles.headerSubtitle, { color: tokens.colors.textSecondary }]}
            numberOfLines={1}
          >
            {device}
          </ThemedText>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusBadgeColor }]}>
          <PulsingDot color="#fff" />
          <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Temperatures */}
        <SectionHeader title="Temperatures" index={0} />
        <View style={styles.grid}>
          {temperatureCards.map(({ key, ...card }, i) => (
            <DataCard key={key} index={i} {...card} />
          ))}
        </View>

        {/* Controls */}
        <SectionHeader title="Controls" index={1} />
        <View style={styles.grid}>
          {controlCards.map(({ key, ...card }, i) => (
            <DataCard key={key} index={i + temperatureCards.length} {...card} />
          ))}
        </View>

        {/* Compressor */}
        <SectionHeader title="Compressor Status" index={2} />
        <View style={styles.grid}>
   
          <DataCard
            label="LP Value"
            value={formatValue(data?.[config.compressor.lp], pressureUnit)}
            icon={Gauge}
            color={HMI_COLORS.compressor.lp}
            index={compressorStartIndex + 1}
          />
          <DataCard
            label="HP Value"
            value={formatValue(data?.[config.compressor.hp], pressureUnit)}
            icon={Gauge}
            color={HMI_COLORS.compressor.hp}
            index={compressorStartIndex + 2}
          />
        </View>

        {/* CR Valves */}
        {crValveCards.length > 0 && (
          <>
            <SectionHeader title="CR Valve Status" index={3} />
            <View style={styles.grid}>
              {crValveCards.map((valve, i) => (
                <CRValveCard
                  key={valve.key}
                  label={valve.label}
                  isOn={valve.isOn}
                  index={i}
                />
              ))}
            </View>
          </>
        )}

        {/* Error */}
        {error && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.errorContainer, { backgroundColor: `${tokens.colors.error}12` }]}
          >
            <Activity color={tokens.colors.error} size={18} />
            <ThemedText style={[styles.errorText, { color: tokens.colors.error }]}>
              {error}
            </ThemedText>
          </Animated.View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
    gap: 8,
  },
  sectionLine: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Card
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  // Error
  errorContainer: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
});
