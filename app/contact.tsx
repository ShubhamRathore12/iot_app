import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Contact Us</ThemedText>
      <ThemedText>Email: support@example.com</ThemedText>
      <ThemedText>Phone: +1 (555) 123-4567</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
