import { useThemeTokens } from '@/providers/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DebugDataDisplayProps {
  data: any[];
  machineName: string;
}

export default function DebugDataDisplay({ data, machineName }: DebugDataDisplayProps) {
  const tokens = useThemeTokens();
  const [expanded, setExpanded] = useState(false);
  
  if (data.length === 0) return null;

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
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text 
          style={[
            styles.title,
            { color: tokens.colors.text }
          ]}
        >
          Debug Data ({data.length} records)
        </Text>
        {expanded ? (
          <ChevronUp size={20} color={tokens.colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={tokens.colors.textSecondary} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <Text 
            style={[
              styles.machineName,
              { color: tokens.colors.textSecondary }
            ]}
          >
            Machine: {machineName}
          </Text>
          <View style={styles.dataContainer}>
            {data.slice(0, 3).map((record, index) => (
              <View 
                key={index}
                style={[
                  styles.record,
                  { 
                    backgroundColor: tokens.colors.background,
                    borderColor: tokens.colors.border,
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.recordTitle,
                    { color: tokens.colors.text }
                  ]}
                >
                  Record {index + 1}
                </Text>
                {Object.entries(record).slice(0, 5).map(([key, value]) => (
                  <View key={key} style={styles.field}>
                    <Text 
                      style={[
                        styles.key,
                        { color: tokens.colors.textSecondary }
                      ]}
                    >
                      {key}:
                    </Text>
                    <Text 
                      style={[
                        styles.value,
                        { color: tokens.colors.text }
                      ]}
                      numberOfLines={1}
                    >
                      {String(value)}
                    </Text>
                  </View>
                ))}
                {Object.keys(record).length > 5 && (
                  <Text 
                    style={[
                      styles.moreText,
                      { color: tokens.colors.textSecondary }
                    ]}
                  >
                    ... and {Object.keys(record).length - 5} more fields
                  </Text>
                )}
              </View>
            ))}
            {data.length > 3 && (
              <Text 
                style={[
                  styles.moreRecords,
                  { color: tokens.colors.textSecondary }
                ]}
              >
                ... and {data.length - 3} more records
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  machineName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  dataContainer: {
    gap: 12,
  },
  record: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  key: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 120,
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  moreRecords: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});