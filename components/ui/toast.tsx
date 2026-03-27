import { ANIMATION_DURATION, SPRING_CONFIG } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import { errorHaptic, successHaptic, warningHaptic } from '@/utils/haptic-utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    type: ToastType;
    message: string;
    duration?: number;
    onHide?: () => void;
    visible: boolean;
}

const Toast: React.FC<ToastProps> = ({
    type,
    message,
    duration = 3000,
    onHide,
    visible
}) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const tokens = useThemeTokens();

    useEffect(() => {
        if (visible) {
            // Trigger haptic feedback
            switch (type) {
                case 'success':
                    successHaptic();
                    break;
                case 'error':
                    errorHaptic();
                    break;
                case 'warning':
                    warningHaptic();
                    break;
            }

            // Slide in animation
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    ...SPRING_CONFIG.bouncy,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: ANIMATION_DURATION.normal,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: ANIMATION_DURATION.normal,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: ANIMATION_DURATION.fast,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide?.();
        });
    };

    const getIcon = () => {
        const iconSize = 20;
        const iconColor = '#ffffff';

        switch (type) {
            case 'success':
                return <CheckCircle size={iconSize} color={iconColor} />;
            case 'error':
                return <XCircle size={iconSize} color={iconColor} />;
            case 'warning':
                return <AlertTriangle size={iconSize} color={iconColor} />;
            case 'info':
                return <Info size={iconSize} color={iconColor} />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return tokens.colors.success;
            case 'error':
                return tokens.colors.error;
            case 'warning':
                return '#f59e0b';
            case 'info':
                return tokens.colors.primary;
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: getBackgroundColor(),
                },
            ]}
        >
            <View style={styles.content}>
                {getIcon()}
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        maxWidth: width - 32,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 9999,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    message: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Toast;
