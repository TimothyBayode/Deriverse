import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, ChevronDown, LogOut, Copy, Check, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, wallet, wallets, select, connect, disconnect, connecting, connected } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setShowWalletList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const address = publicKey?.toBase58() ?? '';
  const truncated = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  const handleSelectWallet = async (walletName: string) => {
    const selected = wallets.find((w) => w.adapter.name === walletName);
    if (selected) {
      select(selected.adapter.name);
      try {
        await connect();
      } catch {
        // User rejected or wallet not available
      }
    }
    setShowWalletList(false);
  };

  // Not connected — show connect button
  if (!connected && !connecting) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowWalletList(!showWalletList)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity glow-primary"
        >
          <Plug className="w-3.5 h-3.5" />
          Connect Wallet
        </button>

        {showWalletList && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-medium text-foreground">Select a Wallet</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Connect to Solana Devnet</p>
            </div>
            <div className="p-1.5">
              {wallets.length > 0 ? (
                wallets.map((w) => (
                  <button
                    key={w.adapter.name}
                    onClick={() => handleSelectWallet(w.adapter.name)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/20 transition-colors"
                  >
                    {w.adapter.icon && (
                      <img src={w.adapter.icon} alt={w.adapter.name} className="w-5 h-5 rounded" />
                    )}
                    <span>{w.adapter.name}</span>
                    {w.readyState === 'Installed' && (
                      <span className="ml-auto text-[10px] text-success font-medium">Detected</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No wallets found. Install Phantom or Backpack.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Connecting state
  if (connecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/20 border border-border text-xs text-muted-foreground"
      >
        <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        Connecting...
      </button>
    );
  }

  // Connected — show address dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/20 border border-border hover:bg-muted/40 transition-colors"
      >
        {wallet?.adapter.icon && (
          <img src={wallet.adapter.icon} alt="" className="w-3.5 h-3.5 rounded" />
        )}
        <span className="text-xs font-mono text-foreground">{truncated}</span>
        <ChevronDown
          className={cn('w-3 h-3 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Connected via {wallet?.adapter.name}
            </p>
            <p className="text-xs font-mono text-foreground break-all">{address}</p>
          </div>
          <div className="p-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/20 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
