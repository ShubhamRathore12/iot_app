import { ANIMATION_DURATION } from '@/constants/animation-config';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

export type TransitionType = 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';

interface PageTransitionProps {
    children: React.ReactNode;
    type?: TransitionType;
    duration?: number;
    style?: StyleProp<ViewStyle>;
}

const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    type = 'fade',
    duration = ANIMATION_DURATION.normal,
    style
}) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        }).start();
    }, []);

    const getAnimatedStyle = (): Animated.WithAnimatedValue<ViewStyle> => {
        switch (type) {
            case 'fade':
                return {
                    opacity: animValue,
                };

            case 'slide':
                return {
                    opacity: animValue,
                    transform: [
                        {
                            translateX: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                };

            case 'slideUp':
                return {
                    opacity: animValue,
                    transform: [
                        {
                            translateY: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                };

            case 'slideDown':
                return {
                    opacity: animValue,
                    transform: [
                        {
                            translateY: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-50, 0],
                            }),
                        },
                    ],
                };

            case 'scale':
                return {
                    opacity: animValue,
                    transform: [
                        {
                            scale: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.9, 1],
                            }),
                        },
                    ],
                };

            default:
                return { opacity: animValue };
        }
    };

    return (
        <Animated.View style={[{ flex: 1 }, style, getAnimatedStyle()]}>
            {children}
        </Animated.View>
    );
};

export default PageTransition;
