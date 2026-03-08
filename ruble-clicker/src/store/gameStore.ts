import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  investments,
  clickUpgrades,
  passiveUpgrades,
  shopItems,
  getUpgradePrice,
  type Booster,
} from '../constants/gameData';

interface InvestmentState {
  price: number;
  history: number[];
  change: number;
}

interface GameState {
  balance: number;
  totalEarned: number;
  totalClicks: number;
  perClick: number;
  perSecond: number;
  boostEnd: number;
  boostMultiplier: number;
  upgradeLevels: Record<string, number>;
  ownedItems: Record<string, boolean>;
  portfolio: Record<string, number>;
  investState: Record<string, InvestmentState>;
  startTime: number;

  // Actions
  click: () => number;
  tick: () => void;
  updatePrices: () => void;
  buyUpgrade: (id: string) => boolean;
  buyInvestment: (ticker: string, amount: number) => boolean;
  sellInvestment: (ticker: string, amount: number) => boolean;
  buyBooster: (booster: Booster) => boolean;
  buyShopItem: (id: string) => boolean;
  getEffectivePerClick: () => number;
  getPortfolioValue: () => number;
  getLevel: () => number;
  resetGame: () => void;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
}

const initialInvestState: Record<string, InvestmentState> = {};
investments.forEach((inv) => {
  initialInvestState[inv.ticker] = {
    price: inv.basePrice,
    history: Array(30).fill(inv.basePrice),
    change: 0,
  };
});

const initialState = {
  balance: 0,
  totalEarned: 0,
  totalClicks: 0,
  perClick: 1,
  perSecond: 0,
  boostEnd: 0,
  boostMultiplier: 1,
  upgradeLevels: {} as Record<string, number>,
  ownedItems: {} as Record<string, boolean>,
  portfolio: {} as Record<string, number>,
  investState: initialInvestState,
  startTime: Date.now(),
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  click: () => {
    const state = get();
    const earned = state.getEffectivePerClick();
    set({
      balance: state.balance + earned,
      totalEarned: state.totalEarned + earned,
      totalClicks: state.totalClicks + 1,
    });
    return earned;
  },

  tick: () => {
    const state = get();
    if (state.perSecond > 0) {
      const earned = state.perSecond / 10; // called every 100ms
      set({
        balance: state.balance + earned,
        totalEarned: state.totalEarned + earned,
      });
    }
    // Check boost expiry
    if (state.boostEnd > 0 && Date.now() > state.boostEnd) {
      set({ boostEnd: 0, boostMultiplier: 1 });
    }
  },

  updatePrices: () => {
    const state = get();
    const newInvestState = { ...state.investState };
    investments.forEach((inv) => {
      const is = { ...newInvestState[inv.ticker] };
      const oldPrice = is.price;
      const random = (Math.random() - 0.5) * 2 * inv.volatility;
      const change = random + inv.trend;
      is.price = Math.max(is.price * 0.1, is.price * (1 + change));
      is.change = ((is.price - oldPrice) / oldPrice) * 100;
      is.history = [...is.history.slice(-29), is.price];
      newInvestState[inv.ticker] = is;
    });
    set({ investState: newInvestState });
  },

  buyUpgrade: (id: string) => {
    const state = get();
    const allUpgrades = [...clickUpgrades, ...passiveUpgrades];
    const upgrade = allUpgrades.find((u) => u.id === id);
    if (!upgrade) return false;

    const level = state.upgradeLevels[id] || 0;
    const price = getUpgradePrice(upgrade.basePrice, level);
    if (state.balance < price) return false;

    const newLevels = { ...state.upgradeLevels, [id]: level + 1 };
    const updates: Partial<GameState> = {
      balance: state.balance - price,
      upgradeLevels: newLevels,
    };

    if (upgrade.type === 'click') {
      updates.perClick = state.perClick + upgrade.basePower;
    } else {
      updates.perSecond = state.perSecond + upgrade.basePower;
    }

    set(updates as any);
    return true;
  },

  buyInvestment: (ticker: string, amount: number) => {
    const state = get();
    const is = state.investState[ticker];
    if (!is) return false;
    const cost = is.price * amount;
    if (state.balance < cost) return false;

    set({
      balance: state.balance - cost,
      portfolio: {
        ...state.portfolio,
        [ticker]: (state.portfolio[ticker] || 0) + amount,
      },
    });
    return true;
  },

  sellInvestment: (ticker: string, amount: number) => {
    const state = get();
    const owned = state.portfolio[ticker] || 0;
    if (owned < amount * 0.999) return false; // float tolerance
    const is = state.investState[ticker];
    if (!is) return false;
    const revenue = is.price * amount;

    set({
      balance: state.balance + revenue,
      totalEarned: state.totalEarned + revenue,
      portfolio: {
        ...state.portfolio,
        [ticker]: Math.max(0, owned - amount),
      },
    });
    return true;
  },

  buyBooster: (booster: Booster) => {
    const state = get();
    if (state.balance < booster.price) return false;
    set({
      balance: state.balance - booster.price,
      boostEnd: Date.now() + booster.duration * 1000,
      boostMultiplier: booster.multiplier,
    });
    return true;
  },

  buyShopItem: (id: string) => {
    const state = get();
    const item = shopItems.find((i) => i.id === id);
    if (!item || state.ownedItems[id] || state.balance < item.price) return false;
    set({
      balance: state.balance - item.price,
      perSecond: state.perSecond + item.passive,
      ownedItems: { ...state.ownedItems, [id]: true },
    });
    return true;
  },

  getEffectivePerClick: () => {
    const state = get();
    return state.perClick * state.boostMultiplier;
  },

  getPortfolioValue: () => {
    const state = get();
    let total = 0;
    for (const ticker in state.portfolio) {
      if (state.portfolio[ticker] > 0 && state.investState[ticker]) {
        total += state.portfolio[ticker] * state.investState[ticker].price;
      }
    }
    return total;
  },

  getLevel: () => {
    const earned = get().totalEarned;
    if (earned >= 100000000) return 10;
    if (earned >= 50000000) return 9;
    if (earned >= 10000000) return 8;
    if (earned >= 5000000) return 7;
    if (earned >= 1000000) return 6;
    if (earned >= 500000) return 5;
    if (earned >= 100000) return 4;
    if (earned >= 10000) return 3;
    if (earned >= 1000) return 2;
    return 1;
  },

  resetGame: () => {
    AsyncStorage.removeItem('ruble_clicker_save');
    set({ ...initialState, startTime: Date.now() });
  },

  saveGame: async () => {
    const state = get();
    try {
      await AsyncStorage.setItem(
        'ruble_clicker_save',
        JSON.stringify({
          balance: state.balance,
          totalEarned: state.totalEarned,
          totalClicks: state.totalClicks,
          perClick: state.perClick,
          perSecond: state.perSecond,
          boostEnd: state.boostEnd,
          boostMultiplier: state.boostMultiplier,
          upgradeLevels: state.upgradeLevels,
          ownedItems: state.ownedItems,
          portfolio: state.portfolio,
          investState: state.investState,
          startTime: state.startTime,
        })
      );
    } catch {}
  },

  loadGame: async () => {
    try {
      const raw = await AsyncStorage.getItem('ruble_clicker_save');
      if (raw) {
        const save = JSON.parse(raw);
        set({
          balance: save.balance || 0,
          totalEarned: save.totalEarned || 0,
          totalClicks: save.totalClicks || 0,
          perClick: save.perClick || 1,
          perSecond: save.perSecond || 0,
          boostEnd: save.boostEnd || 0,
          boostMultiplier: save.boostMultiplier || 1,
          upgradeLevels: save.upgradeLevels || {},
          ownedItems: save.ownedItems || {},
          portfolio: save.portfolio || {},
          investState: save.investState || initialInvestState,
          startTime: save.startTime || Date.now(),
        });
      }
    } catch {}
  },
}));
