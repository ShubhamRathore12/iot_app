import { useThemeTokens } from '@/providers/theme';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'h3' | 'caption';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const tokens = useThemeTokens();

  const getTextStyle = () => {
    switch (type) {
      case 'h1':
        return {
          fontSize: tokens.typography.h1.fontSize,
          fontWeight: tokens.typography.h1.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'h2':
        return {
          fontSize: tokens.typography.h2.fontSize,
          fontWeight: tokens.typography.h2.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'h3':
        return {
          fontSize: tokens.typography.h3.fontSize,
          fontWeight: tokens.typography.h3.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'caption':
        return {
          fontSize: tokens.typography.caption.fontSize,
          fontWeight: tokens.typography.caption.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.textSecondary,
        };
      case 'title':
        return {
          fontSize: 32,
          fontWeight: 'bold' as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'subtitle':
        return {
          fontSize: 20,
          fontWeight: 'bold' as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'defaultSemiBold':
        return {
          fontSize: 16,
          lineHeight: 24,
          fontWeight: '600' as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
          color: tokens.colors.text,
        };
      case 'link':
        return {
          lineHeight: 30,
          fontSize: 16,
          color: tokens.colors.accent,
        };
      case 'default':
      default:
        return {
          fontSize: 16,
          lineHeight: 24,
          color: tokens.colors.text,
        };
    }
  };

  return (
    <Text
      style={[
        getTextStyle(),
        style,
      ]}
      {...rest}
    />
  );
}
