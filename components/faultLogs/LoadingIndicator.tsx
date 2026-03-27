import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingIndicator({ 
  size = 'large', 
  color 
}: LoadingIndicatorProps) {
  const tokens = useThemeTokens();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={size} 
        color={color || tokens.colors.accent} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});