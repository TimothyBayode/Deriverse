import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { portfolioAllocations, CHART_COLORS } from '@/lib/mock-data';

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.accent,
  CHART_COLORS.success,
  CHART_COLORS.purple,
  CHART_COLORS.destructive,
  CHART_COLORS.muted,
];

export function AllocationChart() {
  const total = portfolioAllocations.reduce((s, a) => s + a.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Asset Allocation</h3>
        <p className="text-lg font-bold font-mono text-foreground mt-1">${total.toLocaleString()}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-[220px] w-[220px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioAllocations}
                dataKey="value"
                nameKey="asset"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                strokeWidth={0}
              >
                {portfolioAllocations.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(217 33% 15%)',
                  border: '1px solid hsl(217 33% 22%)',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2 w-full">
          {portfolioAllocations.map((alloc, i) => (
            <div key={alloc.asset} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-sm font-medium text-foreground">{alloc.asset}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground">{alloc.percentage}%</span>
                <span className="text-sm font-mono text-foreground font-medium">
                  ${alloc.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
