import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useThemeMode } from '@/providers/theme';
import { useI18n } from '@/i18n';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Shield,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function RegistrationScreen() {
  const router = useRouter();
  const { effective } = useThemeMode();
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = () => {
    // Handle registration logic here
    router.replace('/(auth)/login');
  };

  const iconColor = effective === 'dark' ? '#94a3b8' : '#64748b';
  const inputBg = effective === 'dark' ? '#1e293b' : '#ffffff';
  const inputBorder = effective === 'dark' ? '#334155' : '#e2e8f0';
  const textColor = effective === 'dark' ? '#f1f5f9' : '#0f172a';
  const placeholderColor = effective === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc' }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[
            styles.logoContainer,
            { backgroundColor: effective === 'dark' ? '#1e293b' : '#e2e8f0' }
          ]}>
            <Shield size={36} color={effective === 'dark' ? '#60a5fa' : '#3b82f6'} />
          </View>
          <Text style={[styles.title, { color: textColor }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: placeholderColor }]}>
            Join Prosafe Automation today
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={iconColor} />
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  color: textColor,
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                },
              ]}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={iconColor} />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={securePassword}
              style={[
                styles.input,
                {
                  color: textColor,
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setSecurePassword(!securePassword)}
            >
              {securePassword ? (
                <EyeOff size={20} color={iconColor} />
              ) : (
                <Eye size={20} color={iconColor} />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={iconColor} />
            </View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={placeholderColor}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              style={[
                styles.input,
                {
                  color: textColor,
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setSecureConfirm(!secureConfirm)}
            >
              {secureConfirm ? (
                <EyeOff size={20} color={iconColor} />
              ) : (
                <Eye size={20} color={iconColor} />
              )}
            </TouchableOpacity>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsContainer}>
            <TouchableOpacity style={[
              styles.checkbox,
              { borderColor: iconColor }
            ]}>
              <Check size={16} color="#3b82f6" />
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: placeholderColor }]}>
              I agree to the Terms & Conditions
            </Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: effective === 'dark' ? '#3b82f6' : '#2563eb' }
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: placeholderColor }]}>
              Already have an account?
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: effective === 'dark' ? '#60a5fa' : '#3b82f6' }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: placeholderColor }]}>
            © 2024 Prosafe Automation. All rights reserved.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 52,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    flex: 1,
  },
  registerButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});