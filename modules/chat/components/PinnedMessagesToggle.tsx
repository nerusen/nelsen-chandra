"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { BsPinAngleFill as PinIcon } from "react-icons/bs";

import { MessageProps } from "@/common/types/chat";

interface PinnedMessagesToggleProps {
  messages: MessageProps[];
  isWidget?: boolean;
}

const PinnedMessagesToggle = ({ messages, isWidget }: PinnedMessagesToggleProps) => {
  const { theme } = useTheme();
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

  // Get pinned messages sorted by creation time (newest first)
  const pinnedMessages = messages
    ?.filter(msg => msg.is_pinned)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  const pinnedCount = pinnedMessages.length;

  // Reset index when pinned messages change
  useEffect(() => {
    setCurrentPinnedIndex(0);
  }, [pinnedCount]);

  const handleToggleClick = () => {
    if (pinnedCount === 0) return;

    // Cycle through pinned messages: newest -> oldest -> back to newest
    const nextIndex = (currentPinnedIndex + 1) % pinnedCount;
    setCurrentPinnedIndex(nextIndex);

    // Scroll to the current pinned message
    const targetMessage = pinnedMessages[currentPinnedIndex];
    if (targetMessage) {
      const messageElement = document.getElementById(`message-${targetMessage.id}`);
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  };

  if (pinnedCount === 0) return null;

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`sticky top-0 z-10 mx-4 mb-2 mt-4 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors ${
          isDark
            ? 'border-neutral-700 bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700/90'
            : 'border-neutral-300 bg-neutral-100/90 text-neutral-700 hover:bg-neutral-200/90'
        } ${isWidget ? 'mx-2' : 'mx-4 lg:mx-8'}`}
      >
        <button
          onClick={handleToggleClick}
          className="flex w-full items-center justify-between transition-opacity hover:opacity-80"
        >
          <div className="flex items-center gap-2">
            <PinIcon size={16} className="text-yellow-500" />
            <span className="hidden sm:inline">Message pinned</span>
            <span className="sm:hidden">Pinned</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
              {pinnedCount}
            </span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default PinnedMessagesToggle;
