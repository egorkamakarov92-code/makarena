export interface Upgrade {
  id: string;
  name: string;
  desc: string;
  icon: string;
  basePrice: number;
  basePower: number;
  type: 'click' | 'passive';
}

export interface Investment {
  ticker: string;
  name: string;
  basePrice: number;
  volatility: number;
  trend: number;
}

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  price: number;
  passive: number;
}

export interface Booster {
  id: string;
  name: string;
  desc: string;
  icon: string;
  price: number;
  duration: number;
  multiplier: number;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const clickUpgrades: Upgrade[] = [
  { id: 'trading_course', name: 'Курсы трейдинга', desc: '+1 ₽/клик', icon: '📚', basePrice: 50, basePower: 1, type: 'click' },
  { id: 'golden_mouse', name: 'Золотая мышка', desc: '+3 ₽/клик', icon: '🖱️', basePrice: 300, basePower: 3, type: 'click' },
  { id: 'diamond_hands', name: 'Алмазные руки', desc: '+10 ₽/клик', icon: '💎', basePrice: 2000, basePower: 10, type: 'click' },
  { id: 'midas_touch', name: 'Прикосновение Мидаса', desc: '+50 ₽/клик', icon: '✨', basePrice: 15000, basePower: 50, type: 'click' },
];

export const passiveUpgrades: Upgrade[] = [
  { id: 'autoclicker', name: 'Бот-автокликер', desc: '+1 ₽/сек', icon: '🤖', basePrice: 100, basePower: 1, type: 'passive' },
  { id: 'office', name: 'Офис', desc: '+5 ₽/сек', icon: '🏢', basePrice: 800, basePower: 5, type: 'passive' },
  { id: 'traders_team', name: 'Команда трейдеров', desc: '+25 ₽/сек', icon: '👥', basePrice: 5000, basePower: 25, type: 'passive' },
  { id: 'hedge_fund', name: 'Хедж-фонд', desc: '+100 ₽/сек', icon: '🏦', basePrice: 30000, basePower: 100, type: 'passive' },
  { id: 'ai_trading', name: 'ИИ-трейдинг', desc: '+500 ₽/сек', icon: '🧠', basePrice: 200000, basePower: 500, type: 'passive' },
  { id: 'central_bank', name: 'Свой ЦБ', desc: '+2500 ₽/сек', icon: '🏛️', basePrice: 1500000, basePower: 2500, type: 'passive' },
];

export const investments: Investment[] = [
  { ticker: 'SBER', name: 'Сбербанк', basePrice: 280, volatility: 0.03, trend: 0.001 },
  { ticker: 'GAZP', name: 'Газпром', basePrice: 165, volatility: 0.04, trend: 0.0005 },
  { ticker: 'YNDX', name: 'Яндекс', basePrice: 3800, volatility: 0.035, trend: 0.002 },
  { ticker: 'LKOH', name: 'Лукойл', basePrice: 7200, volatility: 0.025, trend: 0.001 },
  { ticker: 'BTC', name: 'Биткоин', basePrice: 6500000, volatility: 0.08, trend: 0.003 },
  { ticker: 'USD', name: 'Доллар США', basePrice: 92, volatility: 0.005, trend: 0.0002 },
  { ticker: 'EUR', name: 'Евро', basePrice: 100, volatility: 0.006, trend: 0.0001 },
  { ticker: 'GOLD', name: 'Золото (г)', basePrice: 6800, volatility: 0.02, trend: 0.0015 },
];

export const boosters: Booster[] = [
  { id: 'coffee', name: 'Кофе', desc: 'x2 к клику на 30 сек', icon: '☕', price: 500, duration: 30, multiplier: 2 },
  { id: 'energy_drink', name: 'Энергетик', desc: 'x3 к клику на 20 сек', icon: '⚡', price: 2000, duration: 20, multiplier: 3 },
  { id: 'nootropics', name: 'Ноотропы', desc: 'x5 к клику на 15 сек', icon: '💊', price: 10000, duration: 15, multiplier: 5 },
];

export const shopItems: ShopItem[] = [
  { id: 'laptop', name: 'Ноутбук', desc: '+10 ₽/сек навсегда', icon: '💻', price: 5000, passive: 10 },
  { id: 'tesla', name: 'Тесла', desc: '+50 ₽/сек навсегда', icon: '🚗', price: 50000, passive: 50 },
  { id: 'apartment', name: 'Квартира в Москве', desc: '+200 ₽/сек навсегда', icon: '🏠', price: 500000, passive: 200 },
  { id: 'penthouse', name: 'Пентхаус', desc: '+800 ₽/сек навсегда', icon: '🏙️', price: 3000000, passive: 800 },
  { id: 'yacht', name: 'Яхта', desc: '+2000 ₽/сек навсегда', icon: '🛥️', price: 10000000, passive: 2000 },
  { id: 'island', name: 'Частный остров', desc: '+10000 ₽/сек навсегда', icon: '🏝️', price: 100000000, passive: 10000 },
];

export const achievementDefs: Achievement[] = [
  { id: 'first_click', name: 'Первый клик', icon: '👆', desc: 'Сделай первый клик' },
  { id: 'clicks_100', name: '100 кликов', icon: '💪', desc: '100 кликов' },
  { id: 'clicks_1000', name: '1000 кликов', icon: '🔥', desc: '1000 кликов' },
  { id: 'earn_1k', name: '1K рублей', icon: '💵', desc: 'Заработай 1,000 ₽' },
  { id: 'earn_100k', name: '100K рублей', icon: '💰', desc: 'Заработай 100,000 ₽' },
  { id: 'earn_1m', name: 'Миллионер', icon: '🤑', desc: 'Заработай 1,000,000 ₽' },
  { id: 'earn_100m', name: '100 миллионов', icon: '👑', desc: 'Заработай 100,000,000 ₽' },
  { id: 'first_buy', name: 'Покупатель', icon: '🛒', desc: 'Купи первый предмет' },
  { id: 'investor', name: 'Инвестор', icon: '📈', desc: 'Купи первую акцию' },
  { id: 'car_owner', name: 'Тесла', icon: '🚗', desc: 'Купи Теслу' },
  { id: 'home_owner', name: 'Своё жильё', icon: '🏠', desc: 'Купи квартиру' },
  { id: 'yacht_owner', name: 'Яхта', icon: '🛥️', desc: 'Купи яхту' },
];

export function getUpgradePrice(basePrice: number, level: number): number {
  return Math.floor(basePrice * Math.pow(1.15, level));
}

export function getBuyAmounts(basePrice: number): number[] {
  if (basePrice > 100000) return [0.001, 0.01, 0.1, 1];
  if (basePrice > 1000) return [1, 5, 10, 50];
  return [1, 10, 50, 100];
}
