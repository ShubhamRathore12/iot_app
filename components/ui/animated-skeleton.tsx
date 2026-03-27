/**
 * Skeleton loader component with shimmer animation
 * Provides loading placeholders for better perceived performance
 */

import { ANIMATION_DURATION } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedSkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    variant?: 'rectangle' | 'circle' | 'text';
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
    variant = 'rectangle',
}) => {
    const tokens = useThemeTokens();
    const shimmerTranslate = useSharedValue(-1);

    useEffect(() => {
        shimmerTranslate.value = withRepeat(
            withTiming(1, { duration: ANIMATION_DURATION.verySlow * 3 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: shimmerTranslate.value * 200,
                },
            ],
        };
    });

    const getVariantStyle = (): ViewStyle => {
        if (variant === 'circle') {
            const size = typeof height === 'number' ? height : 40;
            return {
                width: size,
                height: size,
                borderRadius: size / 2,
            };
        }
        if (variant === 'text') {
            return {
                width,
                height: typeof height === 'number' ? height : 16,
                borderRadius: 4,
            };
        }
        return {
            width,
            height,
            borderRadius,
        };
    };

    const baseColor = tokens.colors.surface;
    const highlightColor = tokens.colors.border;

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: baseColor,
                    overflow: 'hidden',
                },
                getVariantStyle(),
                style,
            ]}
        >
            <AnimatedLinearGradient
                colors={[baseColor, highlightColor, baseColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '200%',
                    },
                    animatedStyle,
                ]}
            />
        </Animated.View>
    );
};

export default AnimatedSkeleton;
