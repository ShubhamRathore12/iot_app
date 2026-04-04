import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Cpu, FileText, Globe, LogOut, Moon, Sun, User, UserPlus } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AuthContext } from '@/providers/auth';
import { Mode, useThemeMode, useThemeTokens } from '@/providers/theme';
import { Locale, useI18n } from '@/i18n';
import { SPRING_CONFIG } from '@/constants/animation-config';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Header Action Button ────────────────────────────────────────────
const HeaderActionButton = ({
  onPress,
  label,
  children,
  tokens,
}: {
  onPress: () => void;
  label: string;
  children: React.ReactNode;
  tokens: ReturnType<typeof useThemeTokens>;
}) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, SPRING_CONFIG.stiff);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_CONFIG.default);
      }}
      style={[
        styles.headerButton,
        { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border },
        animStyle,
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {children}
    </AnimatedPressable>
  );
};

// ─── Header Actions ──────────────────────────────────────────────────
const HeaderActions = ({
  mode,
  setMode,
  locale,
  setLocale,
  onLogout,
  tokens,
  t,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  onLogout: () => void;
  tokens: ReturnType<typeof useThemeTokens>;
  t: (key: string) => string;
}) => {
  const iconSize = 20;
  const iconColor = tokens.colors.accent;

  return (
    <View style={styles.headerActionsContainer}>
      <HeaderActionButton
        onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        label={t('Toggle theme')}
        tokens={tokens}
      >
        {mode === 'dark' ? (
          <Sun size={iconSize} color={iconColor} />
        ) : (
          <Moon size={iconSize} color={iconColor} />
        )}
      </HeaderActionButton>

      <HeaderActionButton
        onPress={() => setLocale(locale === 'en' ? 'de' : 'en')}
        label={t('Change language')}
        tokens={tokens}
      >
        <Globe size={iconSize} color={iconColor} />
        <Text style={[styles.languageText, { color: iconColor }]}>
          {locale.toUpperCase()}
        </Text>
      </HeaderActionButton>

      <HeaderActionButton
        onPress={onLogout}
        label={t('Logout')}
        tokens={tokens}
      >
        <LogOut size={iconSize} color={tokens.colors.error} />
      </HeaderActionButton>
    </View>
  );
};

// ─── Custom Animated Tab Bar ─────────────────────────────────────────
const TAB_ICONS: Record<string, (props: { color: string; size: number }) => React.ReactNode> = {
  devices: ({ color, size }) => <Cpu size={size} color={color} />,
  reports: ({ color, size }) => <FileText size={size} color={color} />,
  'registration-form': ({ color, size }) => <UserPlus size={size} color={color} />,
  contact: ({ color, size }) => <User size={size} color={color} />,
};

function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tokens = useThemeTokens();
  const auth = useContext(AuthContext);
  const ma = auth?.monitorAccess || [];
  const maLower = ma.map((a: string) => a.toLowerCase());
  const hasRestrictions = ma.length > 0;
  const hasMachine = maLower.some((a: string) => a.startsWith('gtpl-'));

  // Filter out hidden tabs based on monitorAccess whitelist (match dashboard logic)
  const visibleRoutes = hasRestrictions
    ? state.routes.filter((route) => {
        const name = route.name;
        if (name === 'devices') return hasMachine;
        if (name === 'registration-form') return maLower.includes('registration');
        if (name === 'contact') return maLower.includes('contact') || maLower.includes('contacts');
        return maLower.includes(name.toLowerCase());
      })
    : state.routes;

  return (
    <View style={[styles.tabBar, { backgroundColor: tokens.colors.surface, borderTopColor: tokens.colors.border }]}>
      {visibleRoutes.map((route) => {
        const index = state.routes.indexOf(route);
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel ?? options.title ?? route.name) as string;
        const isFocused = state.index === index;

        const iconRenderer = TAB_ICONS[route.name];

        const onPress = () => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTabButton
            key={route.key}
            isFocused={isFocused}
            label={label}
            iconRenderer={iconRenderer}
            onPress={onPress}
            tokens={tokens}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          />
        );
      })}
    </View>
  );
}

function AnimatedTabButton({
  isFocused,
  label,
  iconRenderer,
  onPress,
  tokens,
  accessibilityLabel,
}: {
  isFocused: boolean;
  label: string;
  iconRenderer?: (props: { color: string; size: number }) => React.ReactNode;
  onPress: () => void;
  tokens: ReturnType<typeof useThemeTokens>;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const activeColor = tokens.colors.accent;
  const inactiveColor = tokens.colors.textSecondary;
  const color = isFocused ? activeColor : inactiveColor;

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isFocused ? activeColor + '15' : 'transparent',
      { duration: 250 }
    ),
    borderRadius: 16,
    paddingHorizontal: withSpring(isFocused ? 16 : 12, SPRING_CONFIG.gentle),
    paddingVertical: 8,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, SPRING_CONFIG.stiff);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_CONFIG.bouncy);
      }}
      style={[styles.tabButton, pressStyle]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabButtonInner, bgStyle]}>
        {iconRenderer?.({ color, size: 22 })}
        {isFocused && (
          <Animated.Text
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[styles.tabLabel, { color: activeColor }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>

      {isFocused && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          layout={LinearTransition.springify().damping(18)}
          style={[styles.tabIndicator, { backgroundColor: activeColor }]}
        />
      )}
    </AnimatedPressable>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────
export default function TabLayout() {
  const auth = useContext(AuthContext);
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, effective } = useThemeMode();
  const tokens = useThemeTokens();

  if (!auth) return null;

  const { logout, monitorAccess } = auth;

  // Whitelist: if monitorAccess is non-empty, only show tabs whose name is in the list
  // "devices" tab always shows if any machine name is present in the list
  const accessLower = (monitorAccess || []).map((a: string) => a.toLowerCase());
  const hasMachineAccess = accessLower.some((a: string) => a.startsWith('gtpl-'));
  const isTabHidden = (name: string) => {
    if (!monitorAccess || monitorAccess.length === 0) return false; // no restrictions
    if (name === 'devices') return !hasMachineAccess;
    if (name === 'registration' || name === 'registration-form') return !accessLower.includes('registration');
    if (name === 'contact') return !accessLower.includes('contact') && !accessLower.includes('contacts');
    return !accessLower.includes(name.toLowerCase());
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <Tabs
      initialRouteName="devices"
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: t('Grain Technik'),
        headerStyle: {
          backgroundColor: tokens.colors.surface,
        },
        headerTintColor: tokens.colors.accent,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerRight: () => (
          <HeaderActions
            mode={mode}
            setMode={setMode}
            locale={locale}
            setLocale={setLocale}
            onLogout={handleLogout}
            tokens={tokens}
            t={t}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="devices"
        options={{
          title: t('devices'),
          tabBarAccessibilityLabel: t('devices'),
          href: isTabHidden('devices') ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('reports'),
          tabBarAccessibilityLabel: t('reports'),
          href: isTabHidden('reports') ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="registration-form"
        options={{
          title: t('Registration'),
          tabBarAccessibilityLabel: t('Registration'),
          href: isTabHidden('registration') ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: t('Contact'),
          tabBarAccessibilityLabel: t('Contact'),
          href: isTabHidden('contact') || isTabHidden('contacts') ? null : undefined,
        }}
      />
    </Tabs>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  headerActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 9,
    marginTop: 1,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
