import { motion } from 'framer-motion';
import { DollarSign, Target, TrendingUp, BarChart3, Zap, Activity } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { CumulativePnLChart } from '@/components/dashboard/CumulativePnLChart';
import { DailyPnLChart } from '@/components/dashboard/DailyPnLChart';
import { MarketBreakdown } from '@/components/dashboard/MarketBreakdown';
import { getOverviewStats } from '@/lib/mock-data';

const Index = () => {
  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your trading performance at a glance • {stats.totalTrades} trades analyzed
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total PnL"
          value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toLocaleString()}`}
          change={`Today: ${stats.todayPnl >= 0 ? '+' : ''}$${stats.todayPnl.toLocaleString()}`}
          changeType={stats.todayPnl >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          delay={0}
          glowColor={stats.totalPnl >= 0 ? 'success' : 'destructive'}
        />
        <KPICard
          label="Win Rate"
          value={`${stats.winRate}%`}
          change={`${stats.totalTrades} total trades`}
          changeType="neutral"
          icon={Target}
          delay={0.05}
          glowColor="primary"
        />
        <KPICard
          label="Profit Factor"
          value={`${stats.profitFactor}x`}
          change={`Avg Win: +$${stats.avgWin.toFixed(0)} / Avg Loss: -$${stats.avgLoss.toFixed(0)}`}
          changeType={stats.profitFactor >= 1 ? 'positive' : 'negative'}
          icon={TrendingUp}
          delay={0.1}
          glowColor="accent"
        />
        <KPICard
          label="Sharpe Ratio"
          value={stats.sharpeRatio.toFixed(2)}
          change={`Max DD: -$${stats.maxDrawdown.toLocaleString()}`}
          changeType={stats.sharpeRatio >= 1 ? 'positive' : 'negative'}
          icon={BarChart3}
          delay={0.15}
          glowColor="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CumulativePnLChart />
        </div>
        <MarketBreakdown />
      </div>

      {/* Daily PnL */}
      <DailyPnLChart />

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Volume', value: `$${(stats.totalVolume / 1000).toFixed(1)}K`, icon: Activity },
          { label: 'Total Fees', value: `$${stats.totalFees.toLocaleString()}`, icon: Zap },
          { label: "Today's Trades", value: `${stats.todayTrades}`, icon: BarChart3 },
          { label: 'Fee Impact', value: `${((stats.totalFees / Math.abs(stats.totalPnl)) * 100).toFixed(1)}%`, icon: DollarSign },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-bold font-mono text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
