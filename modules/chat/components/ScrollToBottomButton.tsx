"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";
import { useTheme } from "next-themes";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  isVisible: boolean;
  isWidget?: boolean;
}

const ScrollToBottomButton = ({ onClick, isVisible, isWidget }: ScrollToBottomButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className={`sticky bottom-0 right-0 z-10 mb-2 mt-4 rounded-lg px-3 py-2 text-sm font-medium backdrop-blur-sm transition-colors ${
            isDark
              ? 'text-neutral-200 hover:bg-neutral-700/50'
              : 'text-neutral-700 hover:bg-neutral-200/50'
          } ${isWidget ? 'mr-2' : 'mr-4 lg:mr-8'}`}
          aria-label="Scroll to bottom"
        >
          <div className="flex items-center gap-2">
            <BsChevronDown size={16} />
            <span className="hidden sm:inline">Scroll to bottom</span>
            <span className="sm:hidden">Scroll</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomButton;
