import { motion } from 'framer-motion';
import { Wallet, Bell, Palette, Shield, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const Settings = () => {
  const settingSections = [
    {
      title: 'Wallet Connection',
      description: 'Connect your Solana wallet to sync trades',
      icon: Wallet,
      status: 'Connected',
      statusColor: 'success' as const,
    },
    {
      title: 'Notifications',
      description: 'Configure alerts for new trades and PnL thresholds',
      icon: Bell,
      status: 'Enabled',
      statusColor: 'success' as const,
    },
    {
      title: 'Appearance',
      description: 'Customize dashboard layout and theme preferences',
      icon: Palette,
      status: 'Dark Mode',
      statusColor: 'primary' as const,
    },
    {
      title: 'Security',
      description: 'Manage API keys and access permissions',
      icon: Shield,
      status: 'Secure',
      statusColor: 'success' as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-3">
        {settingSections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  section.statusColor === 'success' && 'bg-success/15 text-success',
                  section.statusColor === 'primary' && 'bg-primary/15 text-primary'
                )}>
                  {section.status}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border/30"
      >
        <p>Deriverse Analytics v1.0.0</p>
        <p>Built for Solana traders</p>
      </motion.div>
    </div>
  );
};

export default Settings;
