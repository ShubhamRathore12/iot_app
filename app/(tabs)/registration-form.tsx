import AnimatedButton from '@/components/ui/animated-button';
import { SPRING_CONFIG } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import {
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FormData {
  accountType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  accountType?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  locations?: string;
  monitorAccess?: string;
  password?: string;
  confirmPassword?: string;
}

const locationOptions = [
  'Germany', 'Noida - Kanpur', 'Noida', 'Indonesia', 'Salem (Tamil Nadu)', 'Thailand', 'Turkey',
];

const monitorOptions = [
  'Devices', 'Contacts', 'Reports', 'Manufacturer', 'Customer', 'Registration',
  'GTPL-122-gT-1000T-S7-1200', 'GTPL-118-gT-80E-P-S7-200', 'GTPL-108-gT-40E-P-S7-200',
  'GTPL-109-gT-40E-P-S7-200', 'GTPL-110-gT-40E-P-S7-200', 'GTPL-111-gT-80E-P-S7-200',
  'GTPL-112-gT-80E-P-S7-200', 'GTPL-113-gT-80E-P-S7-200', 'GTPL-30-gT-180E-S7-1200',
  'GTPL-115-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-117-gT-320E-S7-1200',
  'GTPL-119-gT-180E-S7-1200', 'GTPL-120-gT-180E-S7-1200', 'GTPL-121-gT-1000T-S7-1200',
  'GTPL-124-GT-450T-S7-1200', 'GTPL-133-GT-650T-S7-1200', 'GTPL-132-300-AP-S7-1200',
  'GTPL-136-gT-450AP', 'GTPL-137-GT-450T-S7-1200', 'GTPL-138-GT-450T-S7-1200',
  'GTPL-134-gT-450T-S7-1200', 'GTPL-135-gT-450T-S7-1200', 'GTPL-061-gT-450T-S7-1200',
  'GTPL-139-GT-300AP-S7-1200', 'GTPL-142-gT-450AP-S7-1200', 'GTPL-143-gT-450AP-S7-1200',
  'GTPL-145-GT-450T-S7-1200', 'GTPL-148-GT-450T-S7-1200',
];

// ─── Animated Input Field ────────────────────────────────────────────
function FormInput({
  icon: Icon,
  label,
  value,
  onChangeText,
  placeholder,
  error,
  tokens,
  secureTextEntry,
  onToggleSecure,
  showSecure,
  keyboardType,
  autoCapitalize,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  placeholder: string;
  error?: string;
  tokens: ReturnType<typeof useThemeTokens>;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  showSecure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences';
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(20)}>
      <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: tokens.colors.surface, borderColor: error ? tokens.colors.error : tokens.colors.border },
        ]}
      >
        <Icon size={18} color={tokens.colors.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: tokens.colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.textSecondary + '80'}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {onToggleSecure && (
          <Pressable onPress={onToggleSecure} hitSlop={8}>
            {showSecure ? (
              <Eye size={18} color={tokens.colors.textSecondary} />
            ) : (
              <EyeOff size={18} color={tokens.colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Animated.Text entering={FadeIn.duration(200)} style={[styles.errorText, { color: tokens.colors.error }]}>
          {error}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

// ─── Chip Toggle ─────────────────────────────────────────────────────
function Chip({
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
        styles.chip,
        {
          backgroundColor: selected ? tokens.colors.accent : tokens.colors.surface,
          borderColor: selected ? tokens.colors.accent : tokens.colors.border,
        },
        animStyle,
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? '#fff' : tokens.colors.textSecondary }]}>
        {selected ? '✓ ' : ''}{label}
      </Text>
    </AnimatedPressable>
  );
}

// ─── Tab Toggle ──────────────────────────────────────────────────────
function AccountTypeTab({
  selected,
  label,
  onPress,
  tokens,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
  tokens: ReturnType<typeof useThemeTokens>;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(selected ? tokens.colors.accent : 'transparent', { duration: 200 }),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95, SPRING_CONFIG.stiff); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG.default); }}
      style={[styles.tabBtn, animStyle, bgStyle]}
    >
      <Text style={[styles.tabBtnText, { color: selected ? '#fff' : tokens.colors.textSecondary }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────
export default function ModernRegistrationForm() {
  const tokens = useThemeTokens();
  const [selectedTab, setSelectedTab] = useState<string>('manufacturer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedMonitorAccess, setSelectedMonitorAccess] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    accountType: 'manufacturer',
    firstName: '', lastName: '', username: '', email: '',
    phoneNumber: '', company: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) => prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]);
  };

  const toggleMonitorAccess = (opt: string) => {
    setSelectedMonitorAccess((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
  };

  const validateForm = (): boolean => {
    const e: Errors = {};
    if (formData.firstName.length < 2) e.firstName = 'First name must be at least 2 characters';
    if (formData.lastName.length < 2) e.lastName = 'Last name must be at least 2 characters';
    if (formData.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    if (formData.phoneNumber.length < 10) e.phoneNumber = 'Phone must be at least 10 digits';
    if (!formData.company) e.company = 'Please select a company';
    if (selectedLocations.length === 0) e.locations = 'Select at least one location';
    if (selectedMonitorAccess.length === 0) e.monitorAccess = 'Select at least one access option';
    if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://grain-backend-1.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locations: selectedLocations,
          monitorAccess: selectedMonitorAccess,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        setFormData({ accountType: '', firstName: '', lastName: '', username: '', email: '', phoneNumber: '', company: '', password: '', confirmPassword: '' });
        setSelectedLocations([]);
        setSelectedMonitorAccess([]);
      } else {
        Alert.alert('Registration Failed', result.message || 'An error occurred.');
      }
    } catch {
      Alert.alert('Error', 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: tokens.colors.accent + '15' }]}>
            <Shield size={28} color={tokens.colors.accent} />
          </View>
          <Text style={[styles.title, { color: tokens.colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
            Fill in your details to get started
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(18)}
          style={[styles.card, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, ...(tokens.elevation.low as any) }]}
        >
          {/* Account Type Tabs */}
          <View style={[styles.tabsContainer, { backgroundColor: tokens.colors.background }]}>
            <AccountTypeTab
              selected={selectedTab === 'manufacturer'}
              label="Manufacturer"
              onPress={() => { setSelectedTab('manufacturer'); handleInputChange('accountType', 'manufacturer'); }}
              tokens={tokens}
            />
            <AccountTypeTab
              selected={selectedTab === 'customer'}
              label="Customer"
              onPress={() => { setSelectedTab('customer'); handleInputChange('accountType', 'customer'); }}
              tokens={tokens}
            />
          </View>

          {/* Name Row */}
          <Animated.View entering={FadeInDown.delay(140).springify().damping(20)} style={styles.row}>
            <View style={styles.halfWidth}>
              <FormInput icon={User} label="First Name" value={formData.firstName}
                onChangeText={(v) => handleInputChange('firstName', v)} placeholder="John"
                error={errors.firstName} tokens={tokens} index={0} />
            </View>
            <View style={styles.halfWidth}>
              <FormInput icon={User} label="Last Name" value={formData.lastName}
                onChangeText={(v) => handleInputChange('lastName', v)} placeholder="Doe"
                error={errors.lastName} tokens={tokens} index={1} />
            </View>
          </Animated.View>

          <FormInput icon={User} label="Username" value={formData.username}
            onChangeText={(v) => handleInputChange('username', v)} placeholder="johndoe123"
            error={errors.username} tokens={tokens} index={2} />

          <FormInput icon={Mail} label="Email Address" value={formData.email}
            onChangeText={(v) => handleInputChange('email', v)} placeholder="john@example.com"
            error={errors.email} tokens={tokens} keyboardType="email-address" autoCapitalize="none" index={3} />

          <FormInput icon={Phone} label="Phone Number" value={formData.phoneNumber}
            onChangeText={(v) => handleInputChange('phoneNumber', v)} placeholder="+1 (555) 000-0000"
            error={errors.phoneNumber} tokens={tokens} keyboardType="phone-pad" index={4} />

          {/* Company Dropdown */}
          <Animated.View entering={FadeInDown.delay(240).springify().damping(20)} style={{ zIndex: 100 }}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>Company</Text>
            <Pressable
              onPress={() => setShowCompanyDropdown(!showCompanyDropdown)}
              style={[
                styles.inputWrapper,
                { backgroundColor: tokens.colors.surface, borderColor: errors.company ? tokens.colors.error : tokens.colors.border },
              ]}
            >
              <Building2 size={18} color={tokens.colors.textSecondary} />
              <Text style={[styles.dropdownText, { color: formData.company ? tokens.colors.text : tokens.colors.textSecondary + '80' }]}>
                {formData.company || 'Select company...'}
              </Text>
              <ChevronDown size={16} color={tokens.colors.textSecondary} />
            </Pressable>
            {showCompanyDropdown && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(100)}
                style={[styles.dropdown, { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, ...(tokens.elevation.medium as any) }]}
              >
                <Pressable
                  onPress={() => { handleInputChange('company', 'Grain Technik'); setShowCompanyDropdown(false); }}
                  style={[styles.dropdownItem, { borderBottomColor: tokens.colors.border }]}
                >
                  <Text style={[styles.dropdownItemText, { color: tokens.colors.text }]}>Grain Technik</Text>
                </Pressable>
              </Animated.View>
            )}
            {errors.company && <Text style={[styles.errorText, { color: tokens.colors.error }]}>{errors.company}</Text>}
          </Animated.View>

          {/* Locations */}
          <Animated.View entering={FadeInDown.delay(280).springify().damping(20)}>
            <View style={styles.sectionHeader}>
              <MapPin size={16} color={tokens.colors.accent} />
              <Text style={[styles.sectionLabel, { color: tokens.colors.text }]}>Locations</Text>
            </View>
            <View style={styles.chipsContainer}>
              {locationOptions.map((loc) => (
                <Chip key={loc} label={loc} selected={selectedLocations.includes(loc)}
                  onPress={() => toggleLocation(loc)} tokens={tokens} />
              ))}
            </View>
            {errors.locations && <Text style={[styles.errorText, { color: tokens.colors.error }]}>{errors.locations}</Text>}
          </Animated.View>

          {/* Monitor Access */}
          <Animated.View entering={FadeInDown.delay(320).springify().damping(20)}>
            <View style={styles.sectionHeader}>
              <Shield size={16} color={tokens.colors.accent} />
              <Text style={[styles.sectionLabel, { color: tokens.colors.text }]}>Monitor Access</Text>
            </View>
            <ScrollView style={styles.chipsScroll} nestedScrollEnabled>
              <View style={styles.chipsContainer}>
                {monitorOptions.map((opt) => (
                  <Chip key={opt} label={opt} selected={selectedMonitorAccess.includes(opt)}
                    onPress={() => toggleMonitorAccess(opt)} tokens={tokens} />
                ))}
              </View>
            </ScrollView>
            {errors.monitorAccess && <Text style={[styles.errorText, { color: tokens.colors.error }]}>{errors.monitorAccess}</Text>}
          </Animated.View>

          {/* Password Fields */}
          <FormInput icon={Lock} label="Password" value={formData.password}
            onChangeText={(v) => handleInputChange('password', v)} placeholder="Min. 8 characters"
            error={errors.password} tokens={tokens} secureTextEntry={!showPassword}
            onToggleSecure={() => setShowPassword(!showPassword)} showSecure={showPassword} index={7} />

          <FormInput icon={Lock} label="Confirm Password" value={formData.confirmPassword}
            onChangeText={(v) => handleInputChange('confirmPassword', v)} placeholder="Re-enter password"
            error={errors.confirmPassword} tokens={tokens} secureTextEntry={!showConfirmPassword}
            onToggleSecure={() => setShowConfirmPassword(!showConfirmPassword)} showSecure={showConfirmPassword} index={8} />

          {/* Submit */}
          <Animated.View entering={FadeInDown.delay(400).springify().damping(20)} style={styles.submitWrapper}>
            <AnimatedButton
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSubmit}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.submitText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.submitText}>Create Account</Text>
              )}
            </AnimatedButton>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15 },
  card: {
    borderRadius: 20, padding: 20, borderWidth: StyleSheet.hairlineWidth, gap: 16,
  },
  tabsContainer: {
    flexDirection: 'row', borderRadius: 14, padding: 4, gap: 4,
  },
  tabBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  tabBtnText: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  errorText: { fontSize: 11, marginTop: 4, marginLeft: 4 },
  dropdownText: { flex: 1, fontSize: 15 },
  dropdown: {
    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
    borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, zIndex: 2000, overflow: 'hidden',
  },
  dropdownItem: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownItemText: { fontSize: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '700' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipsScroll: { maxHeight: 200 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  submitWrapper: { marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
