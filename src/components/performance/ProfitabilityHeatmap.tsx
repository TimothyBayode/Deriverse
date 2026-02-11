import { motion } from 'framer-motion';
import { getHourlyHeatmap } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getHeatColor(value: number, max: number): string {
  if (value === 0) return 'bg-muted/20';
  const intensity = Math.min(Math.abs(value) / max, 1);
  if (value > 0) {
    if (intensity > 0.6) return 'bg-success/80';
    if (intensity > 0.3) return 'bg-success/50';
    return 'bg-success/25';
  }
  if (intensity > 0.6) return 'bg-destructive/80';
  if (intensity > 0.3) return 'bg-destructive/50';
  return 'bg-destructive/25';
}

export function ProfitabilityHeatmap() {
  const { grid, counts } = getHourlyHeatmap();

  // Find max absolute value for scaling
  let maxVal = 0;
  grid.forEach((row) =>
    row.forEach((val) => {
      if (Math.abs(val) > maxVal) maxVal = Math.abs(val);
    })
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Profitability Heatmap</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Day of Week × Hour (UTC)</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex items-center mb-1 ml-10">
            {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
              <span
                key={h}
                className="text-[10px] text-muted-foreground font-mono"
                style={{ width: `${(3 / 24) * 100}%` }}
              >
                {String(h).padStart(2, '0')}
              </span>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] text-muted-foreground w-8 text-right font-mono">{day}</span>
              <div className="flex-1 flex gap-[2px]">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      'flex-1 h-5 rounded-[2px] transition-all duration-200 hover:ring-1 hover:ring-foreground/20 cursor-default',
                      getHeatColor(grid[dayIdx][hour], maxVal)
                    )}
                    title={`${day} ${String(hour).padStart(2, '0')}:00 — PnL: $${Math.round(grid[dayIdx][hour])} (${counts[dayIdx][hour]} trades)`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground">
        <span>Loss</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-3 rounded-sm bg-destructive/80" />
          <div className="w-4 h-3 rounded-sm bg-destructive/50" />
          <div className="w-4 h-3 rounded-sm bg-destructive/25" />
          <div className="w-4 h-3 rounded-sm bg-muted/20" />
          <div className="w-4 h-3 rounded-sm bg-success/25" />
          <div className="w-4 h-3 rounded-sm bg-success/50" />
          <div className="w-4 h-3 rounded-sm bg-success/80" />
        </div>
        <span>Profit</span>
      </div>
    </motion.div>
  );
}
