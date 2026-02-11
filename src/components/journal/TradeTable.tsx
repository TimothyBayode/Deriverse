import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, ArrowUpDown, Clock, Tag } from 'lucide-react';
import { trades, Trade } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type SortKey = 'timestamp' | 'market' | 'pnl' | 'size' | 'duration';
type SortDir = 'asc' | 'desc';

export function TradeTable() {
  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState<'all' | 'long' | 'short'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'winners' | 'losers'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filteredTrades = useMemo(() => {
    let result = [...trades];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.market.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (sideFilter !== 'all') result = result.filter((t) => t.side === sideFilter);
    if (resultFilter === 'winners') result = result.filter((t) => t.pnl > 0);
    if (resultFilter === 'losers') result = result.filter((t) => t.pnl <= 0);

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'timestamp':
          cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'market':
          cmp = a.market.localeCompare(b.market);
          break;
        case 'pnl':
          cmp = a.pnl - b.pnl;
          break;
        case 'size':
          cmp = a.size - b.size;
          break;
        case 'duration':
          cmp = a.duration - b.duration;
          break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [search, sideFilter, resultFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleExport = () => {
    const csv = [
      'Date,Market,Side,Size,Entry,Exit,PnL,PnL%,Duration,Type,Tags',
      ...filteredTrades.map((t) =>
        [
          new Date(t.timestamp).toLocaleDateString(),
          t.market,
          t.side,
          t.size,
          t.entryPrice,
          t.exitPrice,
          t.pnl,
          t.pnlPercent,
          t.duration,
          t.orderType,
          t.tags.join(';'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium transition-all',
        active
          ? 'gradient-primary text-primary-foreground glow-primary'
          : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {label}
    </button>
  );

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <button
      onClick={() => toggleSort(sortKeyName)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className={cn('w-3 h-3', sortKey === sortKeyName && 'text-primary')} />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search markets, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/20 border-border/50 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <FilterChip label="All" active={sideFilter === 'all'} onClick={() => setSideFilter('all')} />
            <FilterChip label="Long" active={sideFilter === 'long'} onClick={() => setSideFilter('long')} />
            <FilterChip label="Short" active={sideFilter === 'short'} onClick={() => setSideFilter('short')} />
            <span className="w-px h-4 bg-border" />
            <FilterChip label="All" active={resultFilter === 'all'} onClick={() => setResultFilter('all')} />
            <FilterChip label="Winners" active={resultFilter === 'winners'} onClick={() => setResultFilter('winners')} />
            <FilterChip label="Losers" active={resultFilter === 'losers'} onClick={() => setResultFilter('losers')} />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 pl-4"><SortHeader label="Date" sortKeyName="timestamp" /></th>
                <th className="text-left p-3"><SortHeader label="Market" sortKeyName="market" /></th>
                <th className="text-left p-3">Side</th>
                <th className="text-right p-3"><SortHeader label="Size" sortKeyName="size" /></th>
                <th className="text-right p-3">Entry</th>
                <th className="text-right p-3">Exit</th>
                <th className="text-right p-3"><SortHeader label="PnL" sortKeyName="pnl" /></th>
                <th className="text-right p-3"><SortHeader label="Duration" sortKeyName="duration" /></th>
                <th className="text-left p-3 pr-4">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.slice(0, 50).map((trade, i) => (
                <tr
                  key={trade.id}
                  className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                >
                  <td className="p-3 pl-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(trade.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    <span className="ml-1 text-muted-foreground/60">
                      {new Date(trade.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-medium text-foreground">{trade.market}</span>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-medium uppercase tracking-wider border-none',
                        trade.side === 'long'
                          ? 'bg-success/15 text-success'
                          : 'bg-destructive/15 text-destructive'
                      )}
                    >
                      {trade.side}
                    </Badge>
                  </td>
                  <td className="p-3 text-right text-sm font-mono text-foreground">
                    ${trade.size.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-sm font-mono text-muted-foreground">
                    {trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right text-sm font-mono text-muted-foreground">
                    {trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={cn(
                    'p-3 text-right text-sm font-mono font-medium',
                    trade.pnl >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString()}
                    <span className="text-[10px] ml-1 opacity-70">
                      ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent}%)
                    </span>
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(trade.duration)}
                    </span>
                  </td>
                  <td className="p-3 pr-4">
                    <div className="flex gap-1 flex-wrap">
                      {trade.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-border/30 text-xs text-muted-foreground flex items-center justify-between">
          <span>Showing {Math.min(50, filteredTrades.length)} of {filteredTrades.length} trades</span>
          <span className="font-mono">
            Net PnL: <span className={cn(
              'font-medium',
              filteredTrades.reduce((s, t) => s + t.pnl, 0) >= 0 ? 'text-success' : 'text-destructive'
            )}>
              ${filteredTrades.reduce((s, t) => s + t.pnl, 0).toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
