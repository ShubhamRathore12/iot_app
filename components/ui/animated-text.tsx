import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  animated?: boolean;
  initialOpacity?: number;
  initialScale?: number;
  delay?: number;
  type?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  numberOfLines?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  animated = true,
  initialOpacity = 0,
  initialScale = 0.9,
  delay = 0,
  type = 'body',
  numberOfLines
}) => {
  const opacity = useSharedValue(initialOpacity);
  const scale = useSharedValue(initialScale);
  
  const tokens = useThemeTokens();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  React.useEffect(() => {
    if (animated) {
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 300 });
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      }, delay);
    } else {
      opacity.value = 1;
      scale.value = 1;
    }
  }, [animated, delay]);

  const getTypographyStyle = (): TextStyle => {
    const typography = tokens.typography[type];
    return {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
      color: tokens.colors.text,
    };
  };

  return (
    <Animated.Text 
      style={[getTypographyStyle(), animated ? animatedStyle : {}, style]} 
      numberOfLines={numberOfLines}
    >
      {children}
    </Animated.Text>
  );
};

export default AnimatedText;