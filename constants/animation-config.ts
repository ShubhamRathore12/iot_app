/**
 * Centralized animation configuration for consistent animations across the app
 * All animations use these constants for timing, easing, and spring physics
 */

import { Easing } from 'react-native';

export const ANIMATION_DURATION = {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
} as const;

export const SPRING_CONFIG = {
    gentle: {
        damping: 20,
        stiffness: 90,
    },
    default: {
        damping: 15,
        stiffness: 150,
    },
    bouncy: {
        damping: 10,
        stiffness: 200,
    },
    stiff: {
        damping: 12,
        stiffness: 300,
    },
} as const;

export const EASING = {
    easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
    easeOut: Easing.bezier(0, 0, 0.2, 1),
    easeIn: Easing.bezier(0.4, 0, 1, 1),
    sharp: Easing.bezier(0.4, 0, 0.6, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;

export const STAGGER_DELAY = {
    short: 50,
    medium: 80,
    long: 120,
} as const;

export const SCALE_VALUES = {
    pressed: 0.95,
    hover: 1.02,
    normal: 1,
    small: 0.8,
} as const;

export const OPACITY_VALUES = {
    hidden: 0,
    disabled: 0.5,
    secondary: 0.7,
    visible: 1,
} as const;

export const TRANSLATION_DISTANCE = {
    small: 10,
    medium: 20,
    large: 30,
    xlarge: 50,
} as const;
