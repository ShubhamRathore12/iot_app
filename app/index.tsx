import LoadingScreen from '@/components/loading-screen';
import { useAuth } from '@/providers/auth';
import { Redirect } from 'expo-router';

export default function Index() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/devices" />;
    }

    return <Redirect href="/(auth)/login" />;
}
