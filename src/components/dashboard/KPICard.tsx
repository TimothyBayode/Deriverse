import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  delay?: number;
  glowColor?: 'primary' | 'accent' | 'success' | 'destructive';
}

export function KPICard({ label, value, change, changeType = 'neutral', icon: Icon, delay = 0, glowColor }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass rounded-xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300',
        glowColor === 'primary' && 'hover:glow-primary',
        glowColor === 'accent' && 'hover:glow-accent',
        glowColor === 'success' && 'hover:glow-success',
        glowColor === 'destructive' && 'hover:glow-destructive'
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 gradient-primary opacity-[0.07] rounded-full blur-2xl group-hover:opacity-[0.12] transition-opacity" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{value}</p>
          {change && (
            <p className={cn(
              'text-xs font-medium mt-1.5',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          glowColor === 'primary' && 'bg-primary/15 text-primary',
          glowColor === 'accent' && 'bg-accent/15 text-accent',
          glowColor === 'success' && 'bg-success/15 text-success',
          glowColor === 'destructive' && 'bg-destructive/15 text-destructive',
          !glowColor && 'bg-primary/15 text-primary'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
