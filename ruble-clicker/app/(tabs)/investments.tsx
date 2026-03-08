import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/GlassCard';
import { GlassButton } from '../../src/components/GlassButton';
import { MiniChart } from '../../src/components/MiniChart';
import { useGameStore } from '../../src/store/gameStore';
import { formatPrice, formatPercent } from '../../src/utils/formatters';
import { investments, getBuyAmounts } from '../../src/constants/gameData';
import { Colors } from '../../src/constants/theme';

function InvestmentCard({ ticker }: { ticker: string }) {
  const inv = investments.find((i) => i.ticker === ticker)!;
  const balance = useGameStore((s) => s.balance);
  const is = useGameStore((s) => s.investState[ticker]);
  const portfolio = useGameStore((s) => s.portfolio[ticker] || 0);
  const buyInvestment = useGameStore((s) => s.buyInvestment);
  const sellInvestment = useGameStore((s) => s.sellInvestment);

  const amounts = getBuyAmounts(inv.basePrice);
  const [selectedAmount, setSelectedAmount] = useState(amounts[0]);

  const cost = is.price * selectedAmount;
  const canBuy = balance >= cost;
  const canSell = portfolio >= selectedAmount * 0.999;

  const { width } = useWindowDimensions();
  const chartWidth = width - 64 - 32; // padding + card padding

  return (
    <GlassCard>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{inv.name}</Text>
          <Text style={styles.ticker}>{inv.ticker}</Text>
        </View>
        <View style={styles.priceArea}>
          <Text style={styles.price}>{formatPrice(is.price)}</Text>
          <Text
            style={[
              styles.change,
              { color: is.change >= 0 ? Colors.green : Colors.red },
            ]}
          >
            {formatPercent(is.change)}
          </Text>
        </View>
      </View>

      <MiniChart data={is.history} width={chartWidth > 0 ? chartWidth : 280} />

      <Text style={styles.portfolio}>
        В портфеле:{' '}
        <Text style={styles.portfolioValue}>
          {portfolio > 0
            ? portfolio < 1
              ? portfolio.toFixed(4)
              : portfolio.toFixed(2)
            : '0'}
        </Text>{' '}
        ({formatPrice(portfolio * is.price)})
      </Text>

      <View style={styles.amountSelector}>
        {amounts.map((a) => (
          <TouchableOpacity
            key={a}
            style={[
              styles.amountChip,
              a === selectedAmount && styles.amountChipActive,
            ]}
            onPress={() => setSelectedAmount(a)}
          >
            <Text
              style={[
                styles.amountChipText,
                a === selectedAmount && styles.amountChipTextActive,
              ]}
            >
              {a < 1 ? a : a} шт
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttons}>
        <GlassButton
          title={`Купить · ${formatPrice(cost)}`}
          variant="buy"
          disabled={!canBuy}
          onPress={() => buyInvestment(ticker, selectedAmount)}
          style={styles.btn}
          textStyle={{ fontSize: 13 }}
        />
        <GlassButton
          title="Продать"
          variant="sell"
          disabled={!canSell}
          onPress={() => sellInvestment(ticker, selectedAmount)}
          style={styles.btn}
          textStyle={{ fontSize: 13 }}
        />
      </View>
    </GlassCard>
  );
}

export default function InvestmentsScreen() {
  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0a2e', '#0d1b2a']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Биржа</Text>
        {investments.map((inv) => (
          <InvestmentCard key={inv.ticker} ticker={inv.ticker} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  ticker: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  priceArea: { alignItems: 'flex-end' },
  price: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  change: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  portfolio: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  portfolioValue: { color: Colors.textPrimary, fontWeight: '600' },
  amountSelector: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  amountChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  amountChipActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderColor: 'rgba(0, 122, 255, 0.4)',
  },
  amountChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  amountChipTextActive: {
    color: Colors.blue,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    marginTop: 0,
  },
});
