import { useThemeTokens } from '@/providers/theme';
import { Stats } from '@/utils/faultLogs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatisticsCardsProps {
  stats: Stats;
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const tokens = useThemeTokens();
  
  const statCards = [
    {
      title: 'Total Tags',
      value: stats.total,
      color: tokens.colors.primary,
    },
    {
      title: 'Active Faults',
      value: stats.activeTags,
      color: tokens.colors.error,
    },
    {
      title: 'Current Page',
      value: `${stats.currentPage}/${stats.totalPages}`,
      color: tokens.colors.accent,
    },
  ];

  return (
    <View style={styles.container}>
      {statCards.map((card, index) => (
        <View 
          key={index}
          style={[
            styles.card,
            { 
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
            }
          ]}
        >
          <Text 
            style={[
              styles.value,
              { color: card.color }
            ]}
          >
            {card.value}
          </Text>
          <Text 
            style={[
              styles.title,
              { color: tokens.colors.textSecondary }
            ]}
          >
            {card.title}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});