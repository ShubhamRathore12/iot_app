import { ANIMATION_DURATION } from '@/constants/animation-config';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedIconProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    animationType?: 'pulse' | 'rotate' | 'bounce' | 'scale';
    duration?: number;
    loop?: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    children,
    style,
    animationType = 'pulse',
    duration = ANIMATION_DURATION.slow,
    loop = true
}) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let animation: Animated.CompositeAnimation;

        switch (animationType) {
            case 'pulse':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(animValue, {
                            toValue: 1,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animValue, {
                            toValue: 0,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;

            case 'rotate':
                animation = Animated.loop(
                    Animated.timing(animValue, {
                        toValue: 1,
                        duration: duration * 2,
                        useNativeDriver: true,
                    })
                );
                break;

            case 'bounce':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(animValue, {
                            toValue: 1,
                            duration: duration / 2,
                            useNativeDriver: true,
                        }),
                        Animated.spring(animValue, {
                            toValue: 0,
                            friction: 3,
                            tension: 40,
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;

            case 'scale':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(animValue, {
                            toValue: 1,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animValue, {
                            toValue: 0,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;
        }

        if (loop) {
            animation.start();
        } else {
            Animated.timing(animValue, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }).start();
        }

        return () => animation?.stop();
    }, [animationType, duration, loop]);

    const getAnimatedStyle = () => {
        switch (animationType) {
            case 'pulse':
                return {
                    opacity: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                    }),
                };

            case 'rotate':
                return {
                    transform: [
                        {
                            rotate: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                            }),
                        },
                    ],
                };

            case 'bounce':
                return {
                    transform: [
                        {
                            translateY: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -10],
                            }),
                        },
                    ],
                };

            case 'scale':
                return {
                    transform: [
                        {
                            scale: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2],
                            }),
                        },
                    ],
                };
        }
    };

    return (
        <Animated.View style={[style, getAnimatedStyle()]}>
            {children}
        </Animated.View>
    );
};

export default AnimatedIcon;
