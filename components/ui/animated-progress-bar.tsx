import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AnimatedProgressBarProps {
  progress: number; // 0 to 1
  style?: StyleProp<ViewStyle>;
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  trackColor?: string;
  animateOnMount?: boolean;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  style,
  height = 8,
  color = 'primary',
  trackColor,
  animateOnMount = true
}) => {
  const progressWidth = useSharedValue(0);
  
  const tokens = useThemeTokens();

  const getColor = () => {
    switch (color) {
      case 'success': return tokens.colors.success;
      case 'warning': return tokens.colors.warning;
      case 'error': return tokens.colors.error;
      case 'accent': return tokens.colors.accent;
      default: return tokens.colors.primary;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
    };
  });

  React.useEffect(() => {
    if (animateOnMount) {
      // Animate to the target progress value
      progressWidth.value = withTiming(progress, { duration: 1000 });
    } else {
      progressWidth.value = progress;
    }
  }, [progress]);

  return (
    <View
      style={[
        {
          height,
          backgroundColor: trackColor || tokens.colors.border,
          borderRadius: height / 2,
          overflow: 'hidden',
        },
        style
      ]}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: getColor(),
            borderRadius: height / 2,
          },
          animatedStyle
        ]}
      />
    </View>
  );
};

export default AnimatedProgressBar;