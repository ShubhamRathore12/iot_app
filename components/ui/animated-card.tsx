import { ANIMATION_DURATION, SPRING_CONFIG, STAGGER_DELAY } from '@/constants/animation-config';
import { useThemeTokens } from '@/providers/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'low' | 'medium' | 'high';
  borderRadius?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  initialScale?: number;
  staggerIndex?: number;
  glassmorphism?: boolean;
  shimmerLoading?: boolean;
  gradientBorder?: boolean;
  gradientColors?: [string, string, ...string[]];
  onPress?: () => void;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  elevation = 'medium',
  borderRadius = 'medium',
  animated = true,
  initialScale = 0.8,
  staggerIndex = 0,
  glassmorphism = false,
  shimmerLoading = false,
  gradientBorder = false,
  gradientColors,
  onPress,
}) => {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);
  const shimmerTranslate = useSharedValue(-1);
  const pressScale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const tokens = useThemeTokens();

  const cardStyle: ViewStyle = {
    backgroundColor: glassmorphism ? 'transparent' : tokens.colors.surface,
    borderRadius: tokens.radius[borderRadius],
    margin: tokens.spacing.md,
    overflow: 'hidden',
    ...(!glassmorphism && tokens.elevation[elevation]),
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { scale: scale.value * pressScale.value },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: shimmerTranslate.value * 300,
        },
      ],
    };
  });

  useEffect(() => {
    if (animated) {
      const delay = staggerIndex * STAGGER_DELAY.medium;

      setTimeout(() => {
        scale.value = withSpring(1, SPRING_CONFIG.default);
        opacity.value = withTiming(1, { duration: ANIMATION_DURATION.normal });
      }, delay);
    } else {
      scale.value = 1;
      opacity.value = 1;
    }
  }, [animated, staggerIndex]);

  useEffect(() => {
    if (shimmerLoading) {
      shimmerTranslate.value = withSequence(
        withDelay(
          staggerIndex * STAGGER_DELAY.short,
          withTiming(1, { duration: ANIMATION_DURATION.verySlow * 2 })
        ),
        withTiming(-1, { duration: 0 })
      );
    }
  }, [shimmerLoading, staggerIndex]);

  const handlePressIn = () => {
    if (onPress) {
      pressScale.value = withSpring(0.98, SPRING_CONFIG.stiff);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      pressScale.value = withSpring(1, SPRING_CONFIG.stiff);
      rotateX.value = withSpring(0, SPRING_CONFIG.default);
      rotateY.value = withSpring(0, SPRING_CONFIG.default);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      rotateX.value = -(event.y / 100) * 10;
      rotateY.value = (event.x / 100) * 10;
    })
    .onEnd(() => {
      rotateX.value = withSpring(0, SPRING_CONFIG.default);
      rotateY.value = withSpring(0, SPRING_CONFIG.default);
    });

  const defaultGradientColors: [string, string, ...string[]] = gradientColors || [tokens.colors.primary, tokens.colors.accent];

  if (onPress) {

    return (
      <GestureDetector gesture={panGesture}>
        <AnimatedPressable
          style={[cardStyle, animated ? animatedStyle : {}, style]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          {glassmorphism && (
            <BlurView
              intensity={20}
              tint="default"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}

          {gradientBorder && (
            <AnimatedLinearGradient
              colors={defaultGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 2,
              }}
            >
              <Animated.View
                style={{
                  flex: 1,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius[borderRadius] - 2,
                }}
              />
            </AnimatedLinearGradient>
          )}

          {shimmerLoading && (
            <AnimatedLinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.1)',
                'transparent',
              ]}
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
                shimmerStyle,
              ]}
            />
          )}

          {children}
        </AnimatedPressable>
      </GestureDetector>
    );
  }

  return (
    <Animated.View style={[cardStyle, animated ? animatedStyle : {}, style]}>
      {glassmorphism && (
        <BlurView
          intensity={20}
          tint="default"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {gradientBorder && (
        <AnimatedLinearGradient
          colors={defaultGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 2,
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius[borderRadius] - 2,
            }}
          />
        </AnimatedLinearGradient>
      )}

      {shimmerLoading && (
        <AnimatedLinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.1)',
            'transparent',
          ]}
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
            shimmerStyle,
          ]}
        />
      )}

      {children}
    </Animated.View>
  );
};

export default AnimatedCard;
