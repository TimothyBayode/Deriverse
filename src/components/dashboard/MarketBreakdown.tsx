import { motion } from 'framer-motion';
import { getMarketBreakdown, CHART_COLORS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const MARKET_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.accent,
  CHART_COLORS.success,
  CHART_COLORS.purple,
  CHART_COLORS.destructive,
  CHART_COLORS.muted,
  '#f59e0b',
  '#8b5cf6',
];

export function MarketBreakdown() {
  const breakdown = getMarketBreakdown();
  const sorted = Object.entries(breakdown).sort((a, b) => b[1].trades - a[1].trades);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-xl p-5"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Market Breakdown</h3>

      <div className="space-y-3">
        {sorted.map(([market, stats], i) => {
          const maxTrades = sorted[0][1].trades;
          const barWidth = (stats.trades / maxTrades) * 100;

          return (
            <div key={market} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{market}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{stats.trades} trades</span>
                  <span className={cn(
                    'font-mono text-xs font-medium',
                    stats.pnl >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {stats.pnl >= 0 ? '+' : ''}${stats.pnl.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: MARKET_COLORS[i % MARKET_COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
