import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../src/store/gameStore';
import { formatMoney } from '../../src/utils/formatters';
import { Colors } from '../../src/constants/theme';

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  anim: Animated.Value;
}

let floatId = 0;

export default function ClickerScreen() {
  const click = useGameStore((s) => s.click);
  const getEffectivePerClick = useGameStore((s) => s.getEffectivePerClick);
  const boostEnd = useGameStore((s) => s.boostEnd);
  const boostMultiplier = useGameStore((s) => s.boostMultiplier);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  const handleClick = useCallback(
    (evt: any) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const earned = click();

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating number
      const id = ++floatId;
      const anim = new Animated.Value(0);
      const x = Math.random() * 100 - 50;

      setFloatingNumbers((prev) => [
        ...prev.slice(-10),
        { id, value: earned, x, y: 0, anim },
      ]);

      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setFloatingNumbers((prev) => prev.filter((f) => f.id !== id));
      });
    },
    [click, scaleAnim]
  );

  const effectivePerClick = getEffectivePerClick();
  const boostActive = boostEnd > Date.now();
  const boostRemaining = boostActive
    ? Math.ceil((boostEnd - Date.now()) / 1000)
    : 0;

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0a2e', '#0d1b2a']}
      style={styles.container}
    >
      <View style={styles.center}>
        <Text style={styles.title}>Рубль Кликер</Text>

        <View style={styles.buttonWrapper}>
          {/* Floating numbers */}
          {floatingNumbers.map((f) => (
            <Animated.Text
              key={f.id}
              style={[
                styles.floatingText,
                {
                  transform: [
                    {
                      translateY: f.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -100],
                      }),
                    },
                    { translateX: f.x },
                    {
                      scale: f.anim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.5, 1.3, 1],
                      }),
                    },
                  ],
                  opacity: f.anim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [1, 1, 0],
                  }),
                },
              ]}
            >
              +{formatMoney(f.value)} ₽
            </Animated.Text>
          ))}

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handleClick}
              activeOpacity={0.8}
              style={styles.clickButton}
            >
              <LinearGradient
                colors={[
                  'rgba(52, 199, 89, 0.25)',
                  'rgba(0, 122, 255, 0.2)',
                  'rgba(175, 82, 222, 0.15)',
                ]}
                style={styles.clickButtonGradient}
              >
                {/* Glass highlight */}
                <View style={styles.glassHighlight} />
                <Text style={styles.clickButtonText}>₽</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.perTapLabel}>
          +{formatMoney(effectivePerClick)} ₽ за тап
        </Text>

        {boostActive && (
          <View style={styles.boostContainer}>
            <Text style={styles.boostLabel}>
              x{boostMultiplier} ещё {boostRemaining} сек
            </Text>
            <View style={styles.boostTrack}>
              <View
                style={[
                  styles.boostFill,
                  { width: `${(boostRemaining / 30) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  clickButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  clickButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassHighlight: {
    position: 'absolute',
    top: '5%',
    left: '15%',
    width: '50%',
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 100,
  },
  clickButtonText: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  floatingText: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.green,
    textShadowColor: 'rgba(52, 199, 89, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 10,
  },
  perTapLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  boostContainer: {
    marginTop: 20,
    width: 250,
    alignItems: 'center',
  },
  boostLabel: {
    fontSize: 13,
    color: Colors.orange,
    marginBottom: 8,
    fontWeight: '600',
  },
  boostTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  boostFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 2,
  },
});
