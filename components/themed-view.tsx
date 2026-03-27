import { useThemeTokens } from '@/providers/theme';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  variant?: 'surface' | 'background' | 'primary' | 'secondary';
};

export function ThemedView({ style, variant = 'background', ...otherProps }: ThemedViewProps) {
  const tokens = useThemeTokens();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return tokens.colors.surface;
      case 'primary':
        return tokens.colors.primary;
      case 'secondary':
        return tokens.colors.secondary;
      case 'background':
      default:
        return tokens.colors.background;
    }
  };

  return <View style={[{ backgroundColor: getBackgroundColor() }, style]} {...otherProps} />;
}
