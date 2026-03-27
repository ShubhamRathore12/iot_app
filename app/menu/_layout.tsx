import { useThemeMode } from '@/providers/theme';
import { Stack } from 'expo-router';

export default function MenuLayout() {
    const { effective } = useThemeMode();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: effective === 'dark' ? '#0f172a' : '#ffffff',
                },
                headerTintColor: effective === 'dark' ? '#60a5fa' : '#2563eb',
                headerTitleStyle: {
                    fontWeight: '700',
                },
                contentStyle: {
                    backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc',
                },
            }}
        >
            <Stack.Screen
                name="[device]/index"
                
                options={{
                    
                    title: 'Device Menu',
                    headerBackTitle: 'Devices',
                }}
            />
        </Stack>
    );
}
