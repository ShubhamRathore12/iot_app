import { useThemeTokens } from '@/providers/theme';
import { Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  loading = false,
  placeholder = "Search tags..."
}: SearchBarProps) {
  const tokens = useThemeTokens();
  
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
      }
    ]}>
      <Search 
        size={20} 
        color={tokens.colors.textSecondary} 
        style={styles.icon}
      />
      <TextInput
        style={[
          styles.input,
          { 
            color: tokens.colors.text,
            backgroundColor: tokens.colors.surface,
          }
        ]}
        value={searchTerm}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.textSecondary}
        editable={!loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
});