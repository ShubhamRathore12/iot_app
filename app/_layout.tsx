import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import SplashScreen from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/i18n';
import { AuthProvider } from '@/providers/auth';
import { MachineStatusProvider } from '@/providers/machine-status';
import { ThemeProviderCustom, useThemeMode } from '@/providers/theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppStack() {
  const { effective } = useThemeMode();

  return (
    <ThemeProvider value={effective === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="menu"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="contact"
          options={{
            headerShown: true,
            title: 'Contact'
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Modal'
          }}
        />
      </Stack>
      <StatusBar style={effective === 'dark' ? 'light' : 'dark'} />
      <Toast />
    </ThemeProvider>
  );
}

// Wrapper with animated splash
function AppWithSplash() {
  const [splashVisible, setSplashVisible] = useState(true);

  if (splashVisible) {
    return (
      <SplashScreen
        onAnimationFinish={() => setSplashVisible(false)}
      />
    );
  }

  return <AppStack />;
}

export default function RootLayout() {
  useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <I18nProvider>
          <ThemeProviderCustom>
            <AuthProvider>
              <MachineStatusProvider>
                <AppWithSplash />
              </MachineStatusProvider>
            </AuthProvider>
          </ThemeProviderCustom>
        </I18nProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
