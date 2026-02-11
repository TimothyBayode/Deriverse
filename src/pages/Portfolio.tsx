import { motion } from 'framer-motion';
import { Shield, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { AllocationChart } from '@/components/portfolio/AllocationChart';
import { getOverviewStats, trades } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const Portfolio = () => {
  const stats = getOverviewStats();

  // Calculate risk metrics
  const longTrades = trades.filter((t) => t.side === 'long');
  const shortTrades = trades.filter((t) => t.side === 'short');
  const longExposure = longTrades.reduce((s, t) => s + t.size, 0);
  const shortExposure = shortTrades.reduce((s, t) => s + t.size, 0);
  const totalExposure = longExposure + shortExposure;
  const longRatio = totalExposure > 0 ? (longExposure / totalExposure) * 100 : 50;

  const riskMetrics = [
    {
      label: 'Max Drawdown',
      value: `-$${stats.maxDrawdown.toLocaleString()}`,
      description: 'Largest peak-to-trough decline',
      icon: TrendingDown,
      severity: stats.maxDrawdown > 2000 ? 'high' : stats.maxDrawdown > 1000 ? 'medium' : 'low',
    },
    {
      label: 'Sharpe Ratio',
      value: stats.sharpeRatio.toFixed(2),
      description: 'Risk-adjusted return metric',
      icon: BarChart3,
      severity: stats.sharpeRatio > 1.5 ? 'low' : stats.sharpeRatio > 0.5 ? 'medium' : 'high',
    },
    {
      label: 'Profit Factor',
      value: `${stats.profitFactor}x`,
      description: 'Gross profit / Gross loss',
      icon: Activity,
      severity: stats.profitFactor > 1.5 ? 'low' : stats.profitFactor > 1 ? 'medium' : 'high',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      description: 'Percentage of winning trades',
      icon: Shield,
      severity: stats.winRate > 55 ? 'low' : stats.winRate > 45 ? 'medium' : 'high',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Portfolio Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Asset allocation and risk metrics</p>
      </motion.div>

      {/* Allocation Chart */}
      <AllocationChart />

      {/* Long/Short Exposure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass rounded-xl p-5"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Exposure Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-success font-medium">Long {longRatio.toFixed(1)}%</span>
            <span className="text-destructive font-medium">Short {(100 - longRatio).toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted/30 overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${longRatio}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-l-full bg-success"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - longRatio}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-r-full bg-destructive"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${longExposure.toLocaleString()} volume</span>
            <span>${shortExposure.toLocaleString()} volume</span>
          </div>
        </div>
      </motion.div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {riskMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-xl font-bold font-mono text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  metric.severity === 'low' && 'bg-success/15 text-success',
                  metric.severity === 'medium' && 'bg-accent/15 text-accent',
                  metric.severity === 'high' && 'bg-destructive/15 text-destructive'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Severity indicator */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'w-8 h-1 rounded-full',
                        metric.severity === 'low' && 'bg-success',
                        metric.severity === 'medium' && level < 2 ? 'bg-accent' : '',
                        metric.severity === 'medium' && level >= 2 ? 'bg-muted/30' : '',
                        metric.severity === 'high' && level < 1 ? 'bg-destructive' : '',
                        metric.severity === 'high' && level >= 1 && metric.severity === 'high' ? 'bg-muted/30' : '',
                        metric.severity === 'low' ? '' : ''
                      )}
                      style={{
                        backgroundColor:
                          metric.severity === 'low'
                            ? undefined
                            : metric.severity === 'medium'
                              ? level < 2
                                ? undefined
                                : undefined
                              : undefined,
                      }}
                    />
                  ))}
                </div>
                <span className={cn(
                  'text-[10px] font-medium uppercase tracking-wider',
                  metric.severity === 'low' && 'text-success',
                  metric.severity === 'medium' && 'text-accent',
                  metric.severity === 'high' && 'text-destructive'
                )}>
                  {metric.severity} risk
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
