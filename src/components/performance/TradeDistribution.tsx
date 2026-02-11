import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { trades, CHART_COLORS } from '@/lib/mock-data';

export function TradeDistribution() {
  // Create PnL distribution buckets
  const buckets: Record<string, number> = {};
  const bucketSize = 100;
  const range = 800;

  for (let i = -range; i <= range; i += bucketSize) {
    buckets[`${i}`] = 0;
  }

  trades.forEach((t) => {
    const bucket = Math.round(Math.max(-range, Math.min(range, t.pnl)) / bucketSize) * bucketSize;
    buckets[`${bucket}`] = (buckets[`${bucket}`] || 0) + 1;
  });

  const data = Object.entries(buckets)
    .map(([bucket, count]) => ({
      bucket: Number(bucket),
      label: `$${bucket}`,
      count,
    }))
    .filter((d) => d.count > 0 || (d.bucket >= -500 && d.bucket <= 500));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">PnL Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Trade outcomes histogram</p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 22% / 0.5)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(217 33% 15%)',
                border: '1px solid hsl(217 33% 22%)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Trades']}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.bucket >= 0 ? CHART_COLORS.success : CHART_COLORS.destructive}
                  fillOpacity={0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
