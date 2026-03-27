import { useThemeTokens } from '@/providers/theme';
import { Loader2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, RefreshControl, RefreshControlProps, StyleSheet, View } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Loader2);

interface CustomRefreshControlProps extends RefreshControlProps {
    onRefresh: () => void;
    refreshing: boolean;
}

export const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
    onRefresh,
    refreshing,
    ...props
}) => {
    const tokens = useThemeTokens();
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (refreshing) {
            Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotation.stopAnimation();
            rotation.setValue(0);
        }
    }, [refreshing]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor="transparent" // Hide default spinner
            colors={['transparent']} // Hide default spinner on Android
            {...props}
        >
            {refreshing && (
                <View style={styles.container}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Loader2 size={24} color={tokens.colors.primary} />
                    </Animated.View>
                </View>
            )}
        </RefreshControl>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
