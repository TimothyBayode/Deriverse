import { motion } from 'framer-motion';
import { ProfitabilityHeatmap } from '@/components/performance/ProfitabilityHeatmap';
import { TradeDistribution } from '@/components/performance/TradeDistribution';
import { WinLossComparison } from '@/components/performance/WinLossComparison';
import { getOverviewStats, trades, CHART_COLORS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const Performance = () => {
  const stats = getOverviewStats();

  // Order type performance
  const orderTypes = ['market', 'limit', 'stop'] as const;
  const orderTypeStats = orderTypes.map((type) => {
    const typeTrades = trades.filter((t) => t.orderType === type);
    const wins = typeTrades.filter((t) => t.pnl > 0).length;
    const totalPnl = typeTrades.reduce((s, t) => s + t.pnl, 0);
    return {
      type,
      trades: typeTrades.length,
      winRate: typeTrades.length > 0 ? Math.round((wins / typeTrades.length) * 100) : 0,
      pnl: Math.round(totalPnl * 100) / 100,
    };
  });

  // Session performance (rough UTC approximation)
  const sessions = [
    { name: 'Asian', start: 0, end: 8 },
    { name: 'London', start: 8, end: 16 },
    { name: 'New York', start: 13, end: 21 },
  ];

  const sessionStats = sessions.map((session) => {
    const sessionTrades = trades.filter((t) => {
      const hour = new Date(t.timestamp).getUTCHours();
      return hour >= session.start && hour < session.end;
    });
    const wins = sessionTrades.filter((t) => t.pnl > 0).length;
    const totalPnl = sessionTrades.reduce((s, t) => s + t.pnl, 0);
    return {
      ...session,
      trades: sessionTrades.length,
      winRate: sessionTrades.length > 0 ? Math.round((wins / sessionTrades.length) * 100) : 0,
      pnl: Math.round(totalPnl * 100) / 100,
    };
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into your trading patterns</p>
      </motion.div>

      {/* Heatmap + Win/Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProfitabilityHeatmap />
        <WinLossComparison />
      </div>

      {/* Distribution */}
      <TradeDistribution />

      {/* Session + Order Type Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Session Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Session Performance</h3>
          <div className="space-y-4">
            {sessionStats.map((session) => (
              <div key={session.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{session.name}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">{session.trades} trades</span>
                    <span className="text-muted-foreground">WR: {session.winRate}%</span>
                    <span className={cn('font-mono font-medium', session.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                      {session.pnl >= 0 ? '+' : ''}${session.pnl.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${session.winRate}%`,
                      backgroundColor: session.pnl >= 0 ? CHART_COLORS.success : CHART_COLORS.destructive,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Type Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Order Type Analysis</h3>
          <div className="space-y-4">
            {orderTypeStats.map((ot) => (
              <div key={ot.type} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary uppercase">{ot.type[0]}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground capitalize">{ot.type}</span>
                    <p className="text-xs text-muted-foreground">{ot.trades} trades</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-sm font-mono font-medium', ot.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                    {ot.pnl >= 0 ? '+' : ''}${ot.pnl.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">WR: {ot.winRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Performance;
