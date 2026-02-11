import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Activity,
  X,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Overview', icon: BarChart3 },
  { path: '/performance', label: 'Performance', icon: TrendingUp },
  { path: '/journal', label: 'Trade Journal', icon: BookOpen },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { publicKey } = useWallet();
  const walletAddress = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Not connected';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen gradient-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-sidebar-border', collapsed && 'justify-center')}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center glow-primary">
              <img src="./favicon.png" alt="Logo" className='rounded-full' />
            </div>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-foreground tracking-tight text-lg"
            >
              Deriverse
            </motion.span>
          )}
          <button onClick={onMobileClose} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Section */}
        <div className={cn('px-3 py-4 border-b border-sidebar-border', collapsed && 'px-2')}>
          <div className={cn(
            'flex items-center gap-2 px-2 py-2 rounded-lg bg-sidebar-accent/10',
            collapsed && 'justify-center px-0'
          )}>
            <Wallet className="w-4 h-4 text-accent flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-mono text-accent truncate">{walletAddress}</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/10'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg gradient-primary opacity-90 glow-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn('w-4 h-4 relative z-10 flex-shrink-0', isActive && 'text-primary-foreground')} />
                {!collapsed && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle - Desktop only */}
        <div className="hidden lg:flex px-3 pb-4">
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
