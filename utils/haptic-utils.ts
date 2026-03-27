/**
 * Haptic feedback utilities for consistent tactile feedback across the app
 * Uses expo-haptics for cross-platform haptic feedback
 */

import * as Haptics from 'expo-haptics';

/**
 * Light haptic feedback for subtle interactions
 * Use for: hover states, minor UI changes
 */
export const lightHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium haptic feedback for standard interactions
 * Use for: button presses, toggles, selections
 */
export const mediumHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy haptic feedback for important interactions
 * Use for: confirmations, deletions, important actions
 */
export const heavyHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Success haptic feedback
 * Use for: successful operations, confirmations
 */
export const successHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Warning haptic feedback
 * Use for: warnings, cautions
 */
export const warningHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Error haptic feedback
 * Use for: errors, failed operations
 */
export const errorHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Selection haptic feedback
 * Use for: picker selections, list item selections
 */
export const selectionHaptic = () => {
    Haptics.selectionAsync();
};
