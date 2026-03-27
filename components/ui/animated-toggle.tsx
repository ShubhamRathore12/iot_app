import { ANIMATION_DURATION, SPRING_CONFIG } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import { mediumHaptic } from '@/utils/haptic-utils';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface AnimatedToggleProps {
  value: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  hapticFeedback?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  icon?: React.ReactNode;
}

const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  value,
  onToggle,
  size = 'medium',
  disabled = false,
  hapticFeedback = true,
  activeColor,
  inactiveColor,
  icon
}) => {
  const translateX = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(value ? 1 : 0);

  const tokens = useThemeTokens();

  // Update animations when value changes
  useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, SPRING_CONFIG.default);
    colorProgress.value = withTiming(value ? 1 : 0, { duration: ANIMATION_DURATION.normal });
  }, [value]);

  const getDimensions = () => {
    if (size === 'small') return { width: 40, height: 20, thumbSize: 16 };
    if (size === 'large') return { width: 60, height: 30, thumbSize: 26 };
    return { width: 50, height: 25, thumbSize: 20 }; // medium
  };

  const { width, height, thumbSize } = getDimensions();

  const defaultActiveColor = activeColor || tokens.colors.success;
  const defaultInactiveColor = inactiveColor || tokens.colors.textSecondary;

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [defaultInactiveColor, defaultActiveColor]
    );

    return {
      backgroundColor,
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value * (width - thumbSize - 4),
        },
        {
          scale: scale.value,
        }
      ],
    };
  });

  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback
    if (hapticFeedback) {
      mediumHaptic();
    }

    // Scale animation on press
    scale.value = withSpring(0.85, SPRING_CONFIG.stiff, () => {
      scale.value = withSpring(1, SPRING_CONFIG.bouncy);
    });

    onToggle();
  };

  const trackStyle = {
    width,
    height,
    borderRadius: height / 2,
    padding: 2,
    justifyContent: 'center' as const,
  };

  const thumbStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    backgroundColor: tokens.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View style={[trackStyle, animatedTrackStyle, { opacity: disabled ? 0.5 : 1 }]}>
        <Animated.View style={[thumbStyle, animatedThumbStyle]}>
          {icon}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedToggle;
