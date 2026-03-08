import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/theme';
import { useGameStore } from '../../src/store/gameStore';
import { formatMoney } from '../../src/utils/formatters';

function HeaderBackground() {
  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0a2e', '#0d1b2a']}
      style={StyleSheet.absoluteFill}
    />
  );
}

function HeaderTitle() {
  const balance = useGameStore((s) => s.balance);
  const perSecond = useGameStore((s) => s.perSecond);
  const getLevel = useGameStore((s) => s.getLevel);

  return (
    <View style={headerStyles.container}>
      <View>
        <Text style={headerStyles.balance}>
          <Text style={headerStyles.currency}>₽ </Text>
          {formatMoney(balance)}
        </Text>
        <Text style={headerStyles.passive}>+{formatMoney(perSecond)} ₽/сек</Text>
      </View>
      <View style={headerStyles.levelBadge}>
        <Text style={headerStyles.levelText}>Ур. {getLevel()}</Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const tick = useGameStore((s) => s.tick);
  const updatePrices = useGameStore((s) => s.updatePrices);
  const saveGame = useGameStore((s) => s.saveGame);

  useEffect(() => {
    // Game tick every 100ms
    const tickInterval = setInterval(tick, 100);
    // Price update every 3s
    const priceInterval = setInterval(updatePrices, 3000);
    // Save every 5s
    const saveInterval = setInterval(saveGame, 5000);

    return () => {
      clearInterval(tickInterval);
      clearInterval(priceInterval);
      clearInterval(saveInterval);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerBackground: HeaderBackground,
        headerTitle: () => <HeaderTitle />,
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: '#0a0a1a',
        },
        tabBarStyle: {
          backgroundColor: Colors.tabBarBg,
          borderTopColor: Colors.glassBorder,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 85,
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        sceneStyle: {
          backgroundColor: '#0a0a1a',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Кликер',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👆</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="upgrades"
        options={{
          title: 'Прокачка',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>⬆️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Биржа',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Магазин',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🛒</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 16,
  },
  balance: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  currency: {
    color: Colors.green,
  },
  passive: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(175, 82, 222, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(175, 82, 222, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.purple,
  },
});
