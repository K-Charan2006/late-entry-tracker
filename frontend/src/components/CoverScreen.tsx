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
    <div className="app-surface min-h-screen flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[min(92vw,52vh)] max-h-[92vh] aspect-[1/1.7] relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/50 bg-white/70 shadow-2xl backdrop-blur-xl"
      >
        <iframe
          loading="lazy"
          className="pointer-events-none absolute -bottom-16 left-0 h-[calc(100%+64px)] w-full border-0"
          src="https://www.canva.com/design/DAHCOYCMQMs/i4ItAnBFIwIlpz-KEUluYQ/view?embed"
          title="Project Cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-white/95" />
      </motion.div>
    </div>
  );
};
