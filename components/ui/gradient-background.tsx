/**
 * Animated gradient background component
 * Provides smooth, slow-moving gradient animations for backgrounds
 */

import { ANIMATION_DURATION } from '@/constants/animation-config';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface GradientBackgroundProps {
    children?: React.ReactNode;
    colors?: string[];
    style?: StyleProp<ViewStyle>;
    animated?: boolean;
    preset?: 'blue' | 'purple' | 'green' | 'orange' | 'dark' | 'light';
}

const GRADIENT_PRESETS = {
    blue: ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6'],
    purple: ['#581c87', '#6b21a8', '#7c3aed', '#8b5cf6'],
    green: ['#065f46', '#047857', '#059669', '#10b981'],
    orange: ['#9a3412', '#c2410c', '#ea580c', '#f97316'],
    dark: ['#0f172a', '#1e293b', '#334155', '#475569'],
    light: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
} as const;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    colors,
    style,
    animated = true,
    preset = 'blue',
}) => {
    const gradientColors = colors || GRADIENT_PRESETS[preset];
    const animationProgress = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            animationProgress.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: ANIMATION_DURATION.verySlow * 6 }),
                    withTiming(0, { duration: ANIMATION_DURATION.verySlow * 6 })
                ),
                -1,
                false
            );
        }
    }, [animated]);

    const animatedStyle = useAnimatedStyle(() => {
        if (!animated) return {};

        return {
            opacity: 0.8 + animationProgress.value * 0.2,
        };
    });

    return (
        <AnimatedLinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                style,
                animatedStyle,
            ]}
        >
            {children}
        </AnimatedLinearGradient>
    );
};

export default GradientBackground;
