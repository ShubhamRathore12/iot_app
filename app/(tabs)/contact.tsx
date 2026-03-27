import { useI18n } from '@/i18n';
import { useThemeTokens } from '@/providers/theme';
import { SPRING_CONFIG } from '@/constants/animation-config';
import { Linking } from 'react-native';
import { Globe, Mail, MapPin, Phone } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ContactItem({
  icon: Icon,
  label,
  value,
  isLink,
  href,
  index,
  tokens,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
  index: number;
  tokens: ReturnType<typeof useThemeTokens>;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(18)}
    >
      <AnimatedPressable
        onPressIn={() => { scale.value = withSpring(0.97, SPRING_CONFIG.stiff); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG.default); }}
        style={[
          styles.contactItem,
          { borderBottomColor: tokens.colors.border },
          animStyle,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: tokens.colors.accent + '15' }]}>
          <Icon size={20} color={tokens.colors.accent} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>{label}</Text>
          {isLink && href ? (
            <Text
              onPress={() => Linking.openURL(href)}
              style={[styles.link, { color: tokens.colors.accent }]}
            >
              {value}
            </Text>
          ) : (
            <Text style={[styles.value, { color: tokens.colors.text }]}>{value}</Text>
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ContactScreen() {
  const { t } = useI18n();
  const tokens = useThemeTokens();

  const contacts = [
    { icon: Mail, label: t('email') || 'Email', value: 'info@graintechnik.com' },
    { icon: Phone, label: t('phone') || 'Phone', value: '+1 (555) 123-4567' },
    { icon: MapPin, label: t('address') || 'Address', value: '123 Grain Street, Tech City' },
    { icon: Globe, label: t('website') || 'Website', value: 'www.graintechnik.com', isLink: true, href: 'https://www.graintechnik.com' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        <Animated.Text
          entering={FadeInDown.duration(400)}
          style={[styles.header, { color: tokens.colors.text }]}
        >
          {t('contact_us') || 'Contact Us'}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(18)}
          style={[
            styles.contactCard,
            {
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
              ...(tokens.elevation.low as any),
            },
          ]}
        >
          {contacts.map((item, i) => (
            <ContactItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              isLink={item.isLink}
              href={item.href}
              index={i}
              tokens={tokens}
            />
          ))}
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(500).springify().damping(18)}
          style={[styles.description, { color: tokens.colors.textSecondary }]}
        >
          {t('contact_description') || 'Feel free to reach out to us for any inquiries, support, or business opportunities.'}
        </Animated.Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  contactCard: {
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    marginLeft: 14,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
