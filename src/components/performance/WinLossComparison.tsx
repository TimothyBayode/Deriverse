import { motion } from 'framer-motion';
import { trades, CHART_COLORS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function WinLossComparison() {
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);

  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
  const maxWin = wins.length > 0 ? Math.max(...wins.map((t) => t.pnl)) : 0;
  const maxLoss = losses.length > 0 ? Math.min(...losses.map((t) => t.pnl)) : 0;
  const avgWinDuration = wins.length > 0 ? wins.reduce((s, t) => s + t.duration, 0) / wins.length : 0;
  const avgLossDuration = losses.length > 0 ? losses.reduce((s, t) => s + t.duration, 0) / losses.length : 0;

  // Consecutive tracking
  let maxConsecWins = 0;
  let maxConsecLosses = 0;
  let currentStreak = 0;
  let lastWin = false;

  const sortedTrades = [...trades].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  sortedTrades.forEach((t, i) => {
    const isWin = t.pnl > 0;
    if (i === 0) {
      currentStreak = 1;
      lastWin = isWin;
    } else if (isWin === lastWin) {
      currentStreak++;
    } else {
      if (lastWin) maxConsecWins = Math.max(maxConsecWins, currentStreak);
      else maxConsecLosses = Math.max(maxConsecLosses, currentStreak);
      currentStreak = 1;
      lastWin = isWin;
    }
  });
  if (lastWin) maxConsecWins = Math.max(maxConsecWins, currentStreak);
  else maxConsecLosses = Math.max(maxConsecLosses, currentStreak);

  const stats = [
    { label: 'Average Win', win: `+$${avgWin.toFixed(0)}`, loss: `-$${avgLoss.toFixed(0)}` },
    { label: 'Best / Worst', win: `+$${maxWin.toFixed(0)}`, loss: `$${maxLoss.toFixed(0)}` },
    { label: 'Avg Duration', win: `${avgWinDuration.toFixed(0)}m`, loss: `${avgLossDuration.toFixed(0)}m` },
    { label: 'Max Streak', win: `${maxConsecWins}`, loss: `${maxConsecLosses}` },
    { label: 'Count', win: `${wins.length}`, loss: `${losses.length}` },
  ];

  const winRate = (wins.length / trades.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Win/Loss Analysis</h3>
      </div>

      {/* Win Rate Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-success font-medium">Wins {winRate.toFixed(1)}%</span>
          <span className="text-destructive font-medium">Losses {(100 - winRate).toFixed(1)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${winRate}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-l-full"
            style={{ backgroundColor: CHART_COLORS.success }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - winRate}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-r-full"
            style={{ backgroundColor: CHART_COLORS.destructive }}
          />
        </div>
      </div>

      {/* Stats Table */}
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <div className="flex items-center gap-6">
              <span className="text-xs font-mono font-medium text-success">{stat.win}</span>
              <span className="text-xs font-mono font-medium text-destructive">{stat.loss}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
