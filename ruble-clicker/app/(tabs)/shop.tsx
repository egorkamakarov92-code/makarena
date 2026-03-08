import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/GlassCard';
import { GlassButton } from '../../src/components/GlassButton';
import { useGameStore } from '../../src/store/gameStore';
import { formatPrice } from '../../src/utils/formatters';
import {
  boosters,
  shopItems,
  type Booster,
  type ShopItem,
} from '../../src/constants/gameData';
import { Colors } from '../../src/constants/theme';

function BoosterCard({ item }: { item: Booster }) {
  const balance = useGameStore((s) => s.balance);
  const buyBooster = useGameStore((s) => s.buyBooster);
  const canAfford = balance >= item.price;

  return (
    <GlassCard>
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
        <View style={styles.priceArea}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <GlassButton
            title="Купить"
            variant="buy"
            disabled={!canAfford}
            onPress={() => buyBooster(item)}
            style={styles.buyBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>
      </View>
    </GlassCard>
  );
}

function ShopItemCard({ item }: { item: ShopItem }) {
  const balance = useGameStore((s) => s.balance);
  const owned = useGameStore((s) => s.ownedItems[item.id]);
  const buyShopItem = useGameStore((s) => s.buyShopItem);
  const canAfford = balance >= item.price && !owned;

  return (
    <GlassCard>
      <View style={styles.row}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: owned
                ? 'rgba(52, 199, 89, 0.15)'
                : 'rgba(0, 122, 255, 0.15)',
            },
          ]}
        >
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          {owned && <Text style={styles.ownedText}>✓ Куплено</Text>}
        </View>
        <View style={styles.priceArea}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {!owned && (
            <GlassButton
              title="Купить"
              variant="buy"
              disabled={!canAfford}
              onPress={() => buyShopItem(item.id)}
              style={styles.buyBtn}
              textStyle={{ fontSize: 13 }}
            />
          )}
        </View>
      </View>
    </GlassCard>
  );
}

export default function ShopScreen() {
  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0a2e', '#0d1b2a']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Магазин</Text>

        <Text style={styles.sectionHeader}>БУСТЕРЫ</Text>
        {boosters.map((b) => (
          <BoosterCard key={b.id} item={b} />
        ))}

        <Text style={styles.sectionHeader}>ПРЕДМЕТЫ</Text>
        {shopItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  desc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  ownedText: { fontSize: 11, color: Colors.cyan, marginTop: 2 },
  priceArea: { alignItems: 'flex-end' },
  price: { fontSize: 15, fontWeight: '600', color: Colors.green },
  buyBtn: { marginTop: 6, paddingVertical: 6, paddingHorizontal: 16 },
});
