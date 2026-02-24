import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface CoverScreenProps {
  onDone: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="app-surface min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">
          <div className="relative w-full pt-[141.4286%]">
            <iframe
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.canva.com/design/DAHCOkOv-tw/clIJCpAHrD98ksZ76SMyOQ/view?embed"
              allowFullScreen
              title="Project Cover"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm font-medium text-slate-600">
          Developed by Charan K
        </p>
      </motion.div>
    </div>
  );
};
