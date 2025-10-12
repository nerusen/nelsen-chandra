"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";
import { useTheme } from "next-themes";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const ScrollToBottomButton = ({ onClick, isVisible }: ScrollToBottomButtonProps) => {
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
          className={`fixed bottom-20 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors border ${
            isDark
              ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700'
              : 'bg-white text-neutral-700 hover:bg-neutral-200 border-neutral-300'
          }`}
          aria-label="Scroll to bottom"
        >
          <BsChevronDown size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomButton;
