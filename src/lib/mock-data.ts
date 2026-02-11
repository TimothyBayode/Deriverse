export interface Trade {
  id: string;
  timestamp: string;
  market: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  exitPrice: number;
  fees: number;
  pnl: number;
  pnlPercent: number;
  duration: number;
  orderType: 'market' | 'limit' | 'stop';
  tags: string[];
  notes: string;
}

export interface DailyMetric {
  date: string;
  totalPnl: number;
  cumulativePnl: number;
  volume: number;
  feesPaid: number;
  winRate: number;
  tradeCount: number;
}

export interface PortfolioAllocation {
  asset: string;
  value: number;
  percentage: number;
}

export const CHART_COLORS = {
  primary: '#667eea',
  accent: '#22d3ee',
  success: '#10b981',
  destructive: '#f43f5e',
  purple: '#9b6dca',
  muted: '#64748b',
  primaryGlow: 'rgba(102, 126, 234, 0.3)',
  accentGlow: 'rgba(34, 211, 238, 0.2)',
};

const MARKETS = ['SOL-PERP', 'BTC-PERP', 'ETH-PERP', 'BONK-PERP', 'JUP-PERP', 'WIF-PERP', 'PYTH-PERP', 'JTO-PERP'];

const BASE_PRICES: Record<string, number> = {
  'SOL-PERP': 178,
  'BTC-PERP': 97500,
  'ETH-PERP': 3450,
  'BONK-PERP': 0.000028,
  'JUP-PERP': 1.12,
  'WIF-PERP': 2.35,
  'PYTH-PERP': 0.42,
  'JTO-PERP': 3.18,
};

const TAGS = ['scalp', 'swing', 'breakout', 'trend', 'reversal', 'news', 'dca', 'momentum'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function generateTrades(): Trade[] {
  const trades: Trade[] = [];
  const now = new Date('2026-02-06T12:00:00Z');

  for (let i = 0; i < 75; i++) {
    const daysAgo = Math.floor(rand() * 30);
    const hoursAgo = Math.floor(rand() * 24);
    const minutesAgo = Math.floor(rand() * 60);
    const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 + hoursAgo * 60 + minutesAgo) * 60 * 1000);

    const market = MARKETS[Math.floor(rand() * MARKETS.length)];
    const side: 'long' | 'short' = rand() > 0.45 ? 'long' : 'short';
    const basePrice = BASE_PRICES[market];
    const entryPrice = basePrice * (1 + (rand() - 0.5) * 0.08);
    const pnlPercent = (rand() - 0.42) * 12;
    const exitPrice = side === 'long'
      ? entryPrice * (1 + pnlPercent / 100)
      : entryPrice * (1 - pnlPercent / 100);
    const size = Math.floor(rand() * 8000) + 200;
    const pnl = size * (pnlPercent / 100);
    const fees = size * 0.0008;
    const duration = Math.floor(rand() * 600) + 3;
    const orderType: Trade['orderType'] = (['market', 'limit', 'stop'] as const)[Math.floor(rand() * 3)];
    const tagCount = Math.floor(rand() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = TAGS[Math.floor(rand() * TAGS.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    trades.push({
      id: `trade-${String(i).padStart(3, '0')}`,
      timestamp: timestamp.toISOString(),
      market,
      side,
      size: Math.round(size * 100) / 100,
      entryPrice: Math.round(entryPrice * 10000) / 10000,
      exitPrice: Math.round(exitPrice * 10000) / 10000,
      fees: Math.round(fees * 100) / 100,
      pnl: Math.round((pnl - fees) * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
      duration,
      orderType,
      tags,
      notes: '',
    });
  }

  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateDailyMetrics(trades: Trade[]): DailyMetric[] {
  const dailyMap: Record<string, Trade[]> = {};

  trades.forEach((trade) => {
    const date = trade.timestamp.split('T')[0];
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(trade);
  });

  const dates = Object.keys(dailyMap).sort();
  let cumPnl = 0;

  return dates.map((date) => {
    const dayTrades = dailyMap[date];
    const totalPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    const wins = dayTrades.filter((t) => t.pnl > 0).length;
    const volume = dayTrades.reduce((sum, t) => sum + t.size, 0);
    const feesPaid = dayTrades.reduce((sum, t) => sum + t.fees, 0);
    cumPnl += totalPnl;

    return {
      date,
      totalPnl: Math.round(totalPnl * 100) / 100,
      cumulativePnl: Math.round(cumPnl * 100) / 100,
      volume: Math.round(volume),
      feesPaid: Math.round(feesPaid * 100) / 100,
      winRate: dayTrades.length > 0 ? Math.round((wins / dayTrades.length) * 100) : 0,
      tradeCount: dayTrades.length,
    };
  });
}

export const trades = generateTrades();
export const dailyMetrics = generateDailyMetrics(trades);

export const portfolioAllocations: PortfolioAllocation[] = [
  { asset: 'SOL', value: 45200, percentage: 38.2 },
  { asset: 'BTC', value: 28400, percentage: 24.0 },
  { asset: 'ETH', value: 18900, percentage: 16.0 },
  { asset: 'JUP', value: 8600, percentage: 7.3 },
  { asset: 'BONK', value: 6200, percentage: 5.2 },
  { asset: 'Others', value: 11000, percentage: 9.3 },
];

// Derived stats
export function getOverviewStats() {
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = (wins.length / trades.length) * 100;
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
  const totalVolume = trades.reduce((sum, t) => sum + t.size, 0);
  const totalFees = trades.reduce((sum, t) => sum + t.fees, 0);
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  // Simple Sharpe approximation
  const dailyReturns = dailyMetrics.map((d) => d.totalPnl);
  const meanReturn = dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length;
  const stdDev = Math.sqrt(dailyReturns.reduce((s, r) => s + Math.pow(r - meanReturn, 2), 0) / dailyReturns.length);
  const sharpeRatio = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0;

  // Max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  dailyMetrics.forEach((d) => {
    if (d.cumulativePnl > peak) peak = d.cumulativePnl;
    const dd = peak - d.cumulativePnl;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  const todayTrades = trades.filter((t) => t.timestamp.startsWith('2026-02-06'));
  const todayPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);

  return {
    totalPnl: Math.round(totalPnl * 100) / 100,
    winRate: Math.round(winRate * 10) / 10,
    avgWin: Math.round(avgWin * 100) / 100,
    avgLoss: Math.round(avgLoss * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    totalVolume: Math.round(totalVolume),
    totalFees: Math.round(totalFees * 100) / 100,
    totalTrades: trades.length,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    todayPnl: Math.round(todayPnl * 100) / 100,
    todayTrades: todayTrades.length,
  };
}

// Hourly performance heatmap data (day of week × hour)
export function getHourlyHeatmap() {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  const counts: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  trades.forEach((t) => {
    const d = new Date(t.timestamp);
    const day = d.getUTCDay();
    const hour = d.getUTCHours();
    grid[day][hour] += t.pnl;
    counts[day][hour]++;
  });

  return { grid, counts };
}

export function getMarketBreakdown() {
  const breakdown: Record<string, { pnl: number; trades: number; winRate: number }> = {};

  trades.forEach((t) => {
    if (!breakdown[t.market]) breakdown[t.market] = { pnl: 0, trades: 0, winRate: 0 };
    breakdown[t.market].pnl += t.pnl;
    breakdown[t.market].trades++;
  });

  Object.keys(breakdown).forEach((m) => {
    const marketTrades = trades.filter((t) => t.market === m);
    const wins = marketTrades.filter((t) => t.pnl > 0).length;
    breakdown[m].winRate = Math.round((wins / marketTrades.length) * 100);
    breakdown[m].pnl = Math.round(breakdown[m].pnl * 100) / 100;
  });

  return breakdown;
}
