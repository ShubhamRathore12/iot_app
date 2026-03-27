import AnimatedProgressBar from '@/components/ui/animated-progress-bar';
import { EASING } from '@/constants/animation-config';
import { useThemeMode } from '@/providers/theme';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const { effective } = useThemeMode();
  // Primary animations
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  // Secondary floating elements
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  
  // Background elements
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;
  const blobAnim3 = useRef(new Animated.Value(0)).current;

  // Progress segments
  const [currentStep, setCurrentStep] = React.useState(0);
  const progressSteps = ['Connecting', 'Validating', 'Authenticating', 'Launching...'];
  
  useEffect(() => {
    // Entrance fade animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: EASING.easeOut,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 15,
        stiffness: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    // Rotate logo infinitely
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: EASING.easeInOut,
        useNativeDriver: true,
      })
    ).start();

    // Heartbeat pulse
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: EASING.easeIn,
          })
        ]),
      ).start();
    };
    setTimeout(startPulse, 1500);
    
    // Show text animation
    const textRevealAnim = (opacityAnimation = textOpacity) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    };
    setTimeout(() => textRevealAnim(), 1000);
    
    // Floating particles
    const animateFloat = (anim: Animated.Value, delay: number, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            easing: EASING.easeInOut,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
            easing: EASING.easeInOut,
          }),
        ]),
      ).start();
    };
    
    animateFloat(floatAnim1, 0, 4000);
    animateFloat(floatAnim2, 1000, 3500);
    animateFloat(floatAnim3, 2000, 3000);
    
    // Background blobs
    const animateBlob = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
            easing: EASING.easeInOut,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
            easing: EASING.easeInOut,
          }),
        ]),
      ).start();
    };
    
    animateBlob(blobAnim1, 0);
    animateBlob(blobAnim2, 2000);
    animateBlob(blobAnim3, 4000);
    
    // Progress simulation
    let step = 0;
    const progressInterval = setInterval(() => {
      if (step < progressSteps.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(progressInterval);
      }
    }, 1500);
    
    return () => clearInterval(progressInterval);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const float1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });
  
  const float2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });
  
  const float3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  
  const blobScale1 = blobAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  
  const blobScale2 = blobAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });
  
  const blobScale3 = blobAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.7],
  });

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <Animated.View style={[
        styles.blob,
        styles.blob1,
        {
          transform: [{ scale: blobScale1 }],
          backgroundColor: effective === 'dark' 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(37, 99, 235, 0.08)',
        }
      ]} />
      <Animated.View style={[
        styles.blob,
        styles.blob2,
        {
          transform: [{ scale: blobScale2 }],
          backgroundColor: effective === 'dark' 
            ? 'rgba(147, 51, 234, 0.1)' 
            : 'rgba(139, 92, 246, 0.08)',
        }
      ]} />
      <Animated.View style={[
        styles.blob,
        styles.blob3,
        {
          transform: [{ scale: blobScale3 }],
          backgroundColor: effective === 'dark' 
            ? 'rgba(236, 72, 153, 0.1)' 
            : 'rgba(236, 72, 153, 0.08)',
        }
      ]} />
      
      {/* Floating Elements */}
      <Animated.View style={[
        styles.floatingElement,
        styles.element1,
        { transform: [{ translateY: float1 }] }
      ]}>
        <View style={[
          styles.elementDot,
          { backgroundColor: effective === 'dark' ? '#60a5fa' : '#3b82f6' }
        ]} />
      </Animated.View>
      
      <Animated.View style={[
        styles.floatingElement,
        styles.element2,
        { transform: [{ translateY: float2 }] }
      ]}>
        <View style={[
          styles.elementDot,
          { backgroundColor: effective === 'dark' ? '#a78bfa' : '#8b5cf6' }
        ]} />
      </Animated.View>
      
      <Animated.View style={[
        styles.floatingElement,
        styles.element3,
        { transform: [{ translateY: float3 }] }
      ]}>
        <View style={[
          styles.elementDot,
          { backgroundColor: effective === 'dark' ? '#f472b6' : '#ec4899' }
        ]} />
      </Animated.View>
      
      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo */}
        <Animated.View style={[
          styles.logoContainer,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim }
            ]
          }
        ]}>
          <View style={[
            styles.logo,
            {
              backgroundColor: effective === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(226, 232, 240, 0.9)',
              shadowColor: effective === 'dark' ? '#3b82f6' : '#2563eb',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }
          ]}>
            <Text style={[
              styles.logoText,
              { color: effective === 'dark' ? '#60a5fa' : '#3b82f6' }
            ]}>
              ✨
            </Text>
          </View>
        </Animated.View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <AnimatedProgressBar
            progress={(currentStep + 1) / progressSteps.length}
            height={6}
            color="primary"
            animateOnMount={false}
            style={styles.progressBar}
          />
        </View>
        
        {/* Loading Text */}
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={[
            styles.loadingText,
            { color: effective === 'dark' ? '#94a3b8' : '#64748b' }
          ]}>
            {progressSteps[currentStep] || 'Loading...'}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoText: {
    fontSize: 50,
  },
  progressBarContainer: {
    width: 200,
    marginBottom: 20,
  },
  progressBar: {
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Background Blobs
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    bottom: -80,
    right: -80,
  },
  blob3: {
    width: 200,
    height: 200,
    top: '40%',
    right: -50,
  },
  // Floating Elements
  floatingElement: {
    position: 'absolute',
    zIndex: 5,
  },
  element1: {
    top: '20%',
    left: '15%',
  },
  element2: {
    top: '60%',
    right: '20%',
  },
  element3: {
    bottom: '25%',
    left: '25%',
  },
  elementDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});