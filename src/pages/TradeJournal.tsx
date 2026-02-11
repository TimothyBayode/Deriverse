import { motion } from 'framer-motion';
import { TradeTable } from '@/components/journal/TradeTable';

const TradeJournal = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Trade Journal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, filter, and annotate your complete trade history
        </p>
      </motion.div>

      <TradeTable />
    </div>
  );
};

export default TradeJournal;
