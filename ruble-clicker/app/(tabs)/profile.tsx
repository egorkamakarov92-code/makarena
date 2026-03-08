import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/GlassCard';
import { GlassButton } from '../../src/components/GlassButton';
import { useGameStore } from '../../src/store/gameStore';
import { formatPrice, formatMoney, formatTime } from '../../src/utils/formatters';
import { achievementDefs } from '../../src/constants/gameData';
import { Colors } from '../../src/constants/theme';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const totalEarned = useGameStore((s) => s.totalEarned);
  const totalClicks = useGameStore((s) => s.totalClicks);
  const perClick = useGameStore((s) => s.perClick);
  const perSecond = useGameStore((s) => s.perSecond);
  const startTime = useGameStore((s) => s.startTime);
  const getPortfolioValue = useGameStore((s) => s.getPortfolioValue);
  const getLevel = useGameStore((s) => s.getLevel);
  const resetGame = useGameStore((s) => s.resetGame);
  const ownedItems = useGameStore((s) => s.ownedItems);
  const portfolio = useGameStore((s) => s.portfolio);

  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  // Achievement checks
  const checkAchievement = (id: string): boolean => {
    switch (id) {
      case 'first_click': return totalClicks >= 1;
      case 'clicks_100': return totalClicks >= 100;
      case 'clicks_1000': return totalClicks >= 1000;
      case 'earn_1k': return totalEarned >= 1000;
      case 'earn_100k': return totalEarned >= 100000;
      case 'earn_1m': return totalEarned >= 1000000;
      case 'earn_100m': return totalEarned >= 100000000;
      case 'first_buy': return Object.keys(ownedItems).length > 0;
      case 'investor': return Object.values(portfolio).some(v => v > 0);
      case 'car_owner': return !!ownedItems['tesla'];
      case 'home_owner': return !!ownedItems['apartment'];
      case 'yacht_owner': return !!ownedItems['yacht'];
      default: return false;
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Сбросить прогресс?',
      'Это действие нельзя отменить. Весь ваш прогресс будет потерян.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: () => resetGame(),
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0a2e', '#0d1b2a']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Профиль</Text>

        <GlassCard>
          <StatRow label="Уровень" value={`${getLevel()}`} />
          <StatRow label="Общий заработок" value={formatPrice(totalEarned)} />
          <StatRow label="Кликов" value={totalClicks.toLocaleString('ru-RU')} />
          <StatRow label="Время в игре" value={formatTime(elapsed)} />
          <StatRow label="Доход за клик" value={formatPrice(perClick)} />
          <StatRow label="Пассивный доход" value={`${formatMoney(perSecond)} ₽/сек`} />
          <StatRow
            label="Портфель"
            value={formatPrice(getPortfolioValue())}
          />
        </GlassCard>

        <Text style={styles.sectionHeader}>ДОСТИЖЕНИЯ</Text>
        <View style={styles.achievementGrid}>
          {achievementDefs.map((ach) => {
            const unlocked = checkAchievement(ach.id);
            return (
              <View
                key={ach.id}
                style={[
                  styles.achievementItem,
                  !unlocked && styles.achievementLocked,
                ]}
              >
                <Text style={styles.achievementIcon}>{ach.icon}</Text>
                <Text style={styles.achievementName}>{ach.name}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionHeader}>УПРАВЛЕНИЕ</Text>
        <GlassCard>
          <GlassButton
            title="Сбросить прогресс"
            variant="danger"
            onPress={handleReset}
            style={{ width: '100%' }}
          />
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  achievementLocked: {
    opacity: 0.3,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  achievementName: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
