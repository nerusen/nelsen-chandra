"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useTheme } from "next-themes";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import useNotif from "@/hooks/useNotif";

interface ClearChatButtonProps {
  onClear: () => void;
  isVisible: boolean;
}

const ClearChatButton = ({ onClear, isVisible }: ClearChatButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: session } = useSession();
  const notif = useNotif();

  const handleClearChat = async () => {
    if (!session?.user?.email) {
      notif("Please sign in to clear chat");
      return;
    }

    try {
      await axios.delete("/api/smart-talk", {
        data: { email: session.user.email }
      });
      notif("Chat cleared successfully");
      onClear();
      setShowConfirm(false);
    } catch (error) {
      console.error("Error clearing chat:", error);
      notif("Failed to clear chat");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowConfirm(true)}
            className={`absolute bottom-16 right-2 z-10 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors ${
              isDark
                ? 'border-neutral-700 bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700/90'
                : 'border-neutral-300 bg-neutral-100/90 text-neutral-700 hover:bg-neutral-200/90'
            }`}
            aria-label="Clear chat"
          >
            <div className="flex items-center gap-2">
              <BsTrash size={16} />
              <span className="hidden sm:inline">Clear Chat</span>
              <span className="sm:hidden">Clear</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`rounded-lg border p-6 shadow-lg ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700'
                  : 'bg-white border-neutral-300'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Clear Chat History?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-center">
                This will permanently delete all your chat messages with the AI. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700'
                      : 'border-neutral-400 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearChat}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClearChatButton;
