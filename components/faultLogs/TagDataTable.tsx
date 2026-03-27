import { useThemeTokens } from '@/providers/theme';
import { TagData } from '@/utils/faultLogs';
import { Check, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface TagDataTableProps {
  tagData: TagData[];
}

export default function TagDataTable({ tagData }: TagDataTableProps) {
  const tokens = useThemeTokens();
  
  const renderTagItem = ({ item }: { item: TagData }) => (
    <View 
      style={[
        styles.row,
        { 
          backgroundColor: tokens.colors.surface,
          borderBottomColor: tokens.colors.border,
        }
      ]}
    >
      <View style={styles.cell}>
        <Text 
          style={[
            styles.tagText,
            { color: tokens.colors.text }
          ]}
          numberOfLines={1}
        >
          {item.tag}
        </Text>
      </View>
      <View style={styles.cell}>
        <View style={styles.statusContainer}>
          {item.isActive ? (
            <Check size={16} color={tokens.colors.success} />
          ) : (
            <X size={16} color={tokens.colors.textSecondary} />
          )}
          <Text 
            style={[
              styles.statusText,
              { 
                color: item.isActive ? tokens.colors.success : tokens.colors.textSecondary
              }
            ]}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <View style={styles.cell}>
        <Text 
          style={[
            styles.valueText,
            { color: tokens.colors.textSecondary }
          ]}
          numberOfLines={1}
        >
          {String(item.value)}
        </Text>
      </View>
    </View>
  );

  if (tagData.length === 0) {
    return (
      <View 
        style={[
          styles.emptyContainer,
          { backgroundColor: tokens.colors.surface }
        ]}
      >
        <Text 
          style={[
            styles.emptyText,
            { color: tokens.colors.textSecondary }
          ]}
        >
          No tag data available
        </Text>
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.border,
        }
      ]}
    >
      {/* Header */}
      <View 
        style={[
          styles.header,
          { 
            backgroundColor: tokens.colors.background,
            borderBottomColor: tokens.colors.border,
          }
        ]}
      >
        <View style={styles.headerCell}>
          <Text 
            style={[
              styles.headerText,
              { color: tokens.colors.text }
            ]}
          >
            Tag Name
          </Text>
        </View>
        <View style={styles.headerCell}>
          <Text 
            style={[
              styles.headerText,
              { color: tokens.colors.text }
            ]}
          >
            Status
          </Text>
        </View>
        <View style={styles.headerCell}>
          <Text 
            style={[
              styles.headerText,
              { color: tokens.colors.text }
            ]}
          >
            Value
          </Text>
        </View>
      </View>
      
      {/* Data Rows */}
      <FlatList
        data={tagData}
        renderItem={renderTagItem}
        keyExtractor={(item, index) => `${item.tag}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    flex: 1,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});