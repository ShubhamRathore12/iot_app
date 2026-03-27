import { useThemeTokens } from '@/providers/theme';
import React, { Suspense, lazy } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LazyScreenProps {
    children: React.ReactNode;
}

export const LazyScreen: React.FC<LazyScreenProps> = ({ children }) => {
    const tokens = useThemeTokens();

    return (
        <Suspense
            fallback={
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={tokens.colors.primary} />
                </View>
            }
        >
            {children}
        </Suspense>
    );
};

// Utility to wrap a component with React.lazy
export function withLazyLoad<P extends object>(
    importFunc: () => Promise<{ default: React.ComponentType<P> }>
) {
    const LazyComponent = lazy(importFunc);

    const WrappedLazyComponent: React.FC<P> = (props) => (
        <LazyScreen>
            <LazyComponent {...props} />
        </LazyScreen>
    );

    WrappedLazyComponent.displayName = 'WithLazyLoad';

    return WrappedLazyComponent;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
