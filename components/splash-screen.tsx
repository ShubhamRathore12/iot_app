import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type SplashScreenProps = {
  onAnimationFinish?: () => void;
};

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  // Main animations
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(15)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Decorative animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1Scale = useRef(new Animated.Value(0.5)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const dotOpacity1 = useRef(new Animated.Value(0)).current;
  const dotOpacity2 = useRef(new Animated.Value(0)).current;
  const dotOpacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Logo appears with spring (0ms)
    const phase1 = Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // Phase 2: Title slides in (400ms delay)
    const phase2 = Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    // Phase 3: Subtitle slides in (200ms after title)
    const phase3 = Animated.parallel([
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(subtitleTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    // Phase 4: Progress bar
    const phase4 = Animated.parallel([
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]);

    // Decorative: Pulse animation (loops)
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Decorative: Ring animations
    const ringAnim1 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 2.5,
            duration: 2000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(ring1Opacity, {
              toValue: 0.4,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(ring1Opacity, {
              toValue: 0,
              duration: 1600,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(ring1Scale, {
          toValue: 0.5,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const ringAnim2 = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.parallel([
          Animated.timing(ring2Scale, {
            toValue: 2.5,
            duration: 2000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(ring2Opacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(ring2Opacity, {
              toValue: 0,
              duration: 1600,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(ring2Scale, {
          toValue: 0.5,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Decorative: Dot animations
    const dotAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(dotOpacity1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ])
    );

    // Start decorative animations
    startPulse();
    ringAnim1.start();
    ringAnim2.start();
    dotAnim.start();

    // Main sequence
    Animated.sequence([
      phase1,
      Animated.delay(200),
      phase2,
      Animated.delay(100),
      phase3,
      Animated.delay(100),
      phase4,
      Animated.delay(300),
      // Fade out
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stop decorative animations
      ringAnim1.stop();
      ringAnim2.stop();
      dotAnim.stop();
      onAnimationFinish?.();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Background gradient layers */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />
      <View style={styles.bgPattern} />

      {/* Animated rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ring1Scale }],
            opacity: ring1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ring2,
          {
            transform: [{ scale: ring2Scale }],
            opacity: ring2Opacity,
          },
        ]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo icon */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseAnim) },
              ],
            },
          ]}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>⚙</Text>
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <Text style={styles.title}>GRAIN TECHNIK</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          }}
        >
          <Text style={styles.subtitle}>App by Prosafe Automation</Text>
        </Animated.View>

        {/* Loading dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity1 }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity2 }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity3 }]} />
        </View>

        {/* Progress bar */}
        <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            {/* Shimmer overlay */}
            <Animated.View
              style={[
                styles.progressShimmer,
                {
                  opacity: progressWidth.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [0, 0.6, 0.6, 0],
                  }),
                  transform: [
                    {
                      translateX: progressWidth.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, width * 0.6],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* Bottom branding */}
      <Animated.View style={[styles.footer, { opacity: subtitleOpacity }]}>
        <Text style={styles.footerText}>Industrial IoT Solutions</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  bgLayer2: {
    position: 'absolute',
    top: -height * 0.3,
    right: -width * 0.3,
    width: height * 0.8,
    height: height * 0.8,
    borderRadius: height * 0.4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  bgPattern: {
    position: 'absolute',
    bottom: -height * 0.2,
    left: -width * 0.2,
    width: height * 0.6,
    height: height * 0.6,
    borderRadius: height * 0.3,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  ring2: {
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 36,
    color: '#60a5fa',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94a3b8',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60a5fa',
  },
  progressContainer: {
    width: width * 0.6,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    color: '#334155',
  },
});
