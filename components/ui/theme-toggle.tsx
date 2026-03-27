import { useThemeMode } from '@/providers/theme';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'medium'
}) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const { mode, setMode, effective } = useThemeMode();

  const getDimensions = () => {
    if (size === 'small') return { width: 40, height: 20, iconSize: 14 };
    if (size === 'large') return { width: 60, height: 30, iconSize: 20 };
    return { width: 50, height: 25, iconSize: 16 }; // medium
  };

  const { width, height, iconSize } = getDimensions();

  const animatedRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotate.value}deg`,
        },
      ],
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    // Animation effect
    scale.value = withSpring(0.9, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    
    // Rotate animation
    rotate.value = withSpring(rotate.value + 180, { damping: 10, stiffness: 150 });
    
    // Toggle theme
    setMode(effective === 'dark' ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      <View style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: effective === 'dark' ? '#334155' : '#e2e8f0',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
        <Animated.View style={[animatedScaleStyle, animatedRotateStyle]}>
          {effective === 'dark' ? (
            <Moon size={iconSize} color="#fbbf24" />
          ) : (
            <Sun size={iconSize} color="#f59e0b" />
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;