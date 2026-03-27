import { ANIMATION_DURATION, SCALE_VALUES, SPRING_CONFIG } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import { mediumHaptic } from '@/utils/haptic-utils';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Animated as RNAnimated, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: boolean;
  gradientColors?: [string, string, ...string[]];
  activeOpacity?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  children,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  gradientColors,
  activeOpacity = 0.7
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [rippleScale] = useState(new RNAnimated.Value(0));
  const [rippleOpacity] = useState(new RNAnimated.Value(0));

  const tokens = useThemeTokens();

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.radius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    const variantStyle: ViewStyle = {
      ...tokens.elevation.medium,
      backgroundColor: disabled ? tokens.colors.textSecondary : tokens.colors.primary,
    };

    if (variant === 'secondary') {
      variantStyle.backgroundColor = tokens.colors.secondary;
    } else if (variant === 'outline') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderWidth = 2;
      variantStyle.borderColor = tokens.colors.border;
    } else if (variant === 'ghost') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderWidth = 0;
      delete variantStyle.shadowColor;
      delete variantStyle.shadowOffset;
      delete variantStyle.shadowOpacity;
      delete variantStyle.shadowRadius;
      delete variantStyle.elevation;
    } else if (variant === 'gradient') {
      variantStyle.backgroundColor = 'transparent';
    }

    return [baseStyle, variantStyle];
  };

  const getSizeStyles = () => {
    const sizeStyle: ViewStyle = {};

    if (size === 'small') {
      sizeStyle.paddingHorizontal = tokens.spacing.sm;
      sizeStyle.paddingVertical = tokens.spacing.xs;
    } else if (size === 'large') {
      sizeStyle.paddingHorizontal = tokens.spacing.lg;
      sizeStyle.paddingVertical = tokens.spacing.md;
    } else { // medium
      sizeStyle.paddingHorizontal = tokens.spacing.md;
      sizeStyle.paddingVertical = tokens.spacing.sm;
    }

    return sizeStyle;
  };

  const getTextColor = () => {
    if (disabled) return tokens.colors.textSecondary;
    if (variant === 'outline' || variant === 'ghost') return tokens.colors.text;
    return tokens.colors.surface;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (disabled || loading) return;

    scale.value = withSpring(SCALE_VALUES.pressed, SPRING_CONFIG.stiff);

    // Ripple effect
    RNAnimated.parallel([
      RNAnimated.timing(rippleScale, {
        toValue: 1,
        duration: ANIMATION_DURATION.slow,
        useNativeDriver: true,
      }),
      RNAnimated.timing(rippleOpacity, {
        toValue: 0.3,
        duration: ANIMATION_DURATION.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    scale.value = withSpring(1, SPRING_CONFIG.stiff);

    // Fade out ripple
    RNAnimated.timing(rippleOpacity, {
      toValue: 0,
      duration: ANIMATION_DURATION.normal,
      useNativeDriver: true,
    }).start(() => {
      rippleScale.setValue(0);
    });
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      mediumHaptic();
    }

    onPress(event);
  };

  const defaultGradientColors: [string, string, ...string[]] = gradientColors || [tokens.colors.primary, tokens.colors.accent];

  const renderContent = () => (
    <>
      {/* Ripple effect */}
      <RNAnimated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          transform: [{ scale: rippleScale }],
          opacity: rippleOpacity,
          borderRadius: tokens.radius.medium,
        }}
      />

      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : children ? (
        <>{children}</>
      ) : (
        <Text
          style={[
            {
              color: getTextColor(),
              fontSize: size === 'small' ? tokens.typography.caption.fontSize : tokens.typography.body.fontSize,
              fontWeight: '600',
              textAlign: 'center',
            },
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, getVariantStyles(), getSizeStyles(), style]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <AnimatedLinearGradient
          colors={defaultGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {renderContent()}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      style={[animatedStyle, getVariantStyles(), getSizeStyles(), style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

export default AnimatedButton;
