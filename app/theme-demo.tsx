import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AnimatedButton from '@/components/ui/animated-button';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedProgressBar from '@/components/ui/animated-progress-bar';
import AnimatedText from '@/components/ui/animated-text';
import AnimatedToggle from '@/components/ui/animated-toggle';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useThemeMode, useThemeTokens } from '@/providers/theme';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ThemeDemoScreen() {
  const { effective, setMode } = useThemeMode();
  const tokens = useThemeTokens();
  const insets = useSafeAreaInsets();
  const [toggleValue, setToggleValue] = useState(false);
  const [progress, setProgress] = useState(0.3);

  const handleBack = () => {
    // In a real app, you'd navigate back
    console.log("Navigate back");
  };

  const increaseProgress = () => {
    setProgress(prev => Math.min(1, prev + 0.1));
  };

  const decreaseProgress = () => {
    setProgress(prev => Math.max(0, prev - 0.1));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={tokens.colors.text} />
        </TouchableOpacity>
        <View>
          <ThemedText style={styles.headerTitle}>Theme Demo</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Consistent UI System</ThemedText>
        </View>
        <View style={styles.themeToggleContainer}>
          <ThemeToggle size="medium" />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedCard animated={true} initialScale={0.95}>
          <AnimatedText style={styles.sectionTitle} type="h2">Typography</AnimatedText>
          
          <AnimatedText type="h1">Heading 1</AnimatedText>
          <AnimatedText type="h2">Heading 2</AnimatedText>
          <AnimatedText type="h3">Heading 3</AnimatedText>
          <AnimatedText type="body">Body Text</AnimatedText>
          <AnimatedText type="caption">Caption Text</AnimatedText>
        </AnimatedCard>

        <AnimatedCard animated={true} initialScale={0.95} style={{ marginTop: 16 }}>
          <AnimatedText style={styles.sectionTitle} type="h2">Buttons</AnimatedText>
          
          <AnimatedButton 
            title="Primary Button" 
            onPress={() => console.log('Pressed')} 
            variant="primary" 
            size="medium"
            style={{ marginBottom: 12 }}
          />
          
          <AnimatedButton 
            title="Secondary Button" 
            onPress={() => console.log('Pressed')} 
            variant="secondary" 
            size="medium"
            style={{ marginBottom: 12 }}
          />
          
          <AnimatedButton 
            title="Outline Button" 
            onPress={() => console.log('Pressed')} 
            variant="outline" 
            size="medium"
            style={{ marginBottom: 12 }}
          />
          
          <AnimatedButton 
            title="Ghost Button" 
            onPress={() => console.log('Pressed')} 
            variant="ghost" 
            size="medium"
          />
        </AnimatedCard>

        <AnimatedCard animated={true} initialScale={0.95} style={{ marginTop: 16 }}>
          <AnimatedText style={styles.sectionTitle} type="h2">Interactive Components</AnimatedText>
          
          <View style={styles.row}>
            <AnimatedText style={styles.label}>Toggle:</AnimatedText>
            <AnimatedToggle value={toggleValue} onToggle={() => setToggleValue(!toggleValue)} />
          </View>
          
          <View style={styles.row}>
            <AnimatedText style={styles.label}>Progress:</AnimatedText>
            <View style={{ flex: 1 }}>
              <AnimatedProgressBar progress={progress} height={8} />
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <AnimatedButton 
              title="-" 
              onPress={decreaseProgress} 
              variant="outline" 
              size="small"
            />
            <AnimatedText style={styles.progressValue}>{Math.round(progress * 100)}%</AnimatedText>
            <AnimatedButton 
              title="+" 
              onPress={increaseProgress} 
              variant="outline" 
              size="small"
            />
          </View>
        </AnimatedCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  themeToggleContainer: {
    marginLeft: 'auto',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  label: {
    minWidth: 80,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  progressValue: {
    minWidth: 40,
    textAlign: 'center',
  },
});