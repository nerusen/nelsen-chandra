"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useTheme } from "next-themes";
import axios from "axios";
import { useSession } from "next-auth/react";

import useNotif from "@/hooks/useNotif";

interface ClearChatConfirmPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearChatConfirmPopup = ({
  isVisible,
  onClose,
  onConfirm,
}: ClearChatConfirmPopupProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: session } = useSession();
  const notif = useNotif();

  const handleConfirm = async () => {
    if (!session?.user?.email) {
      notif("Please sign in to clear chat");
      return;
    }

    try {
      await axios.delete("/api/smart-talk", {
        data: { email: session.user.email }
      });
      notif("Chat cleared successfully");
      onConfirm();
      onClose();
    } catch (error) {
      console.error("Error clearing chat:", error);
      notif("Failed to clear chat");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className={`w-full max-w-md rounded-xl border shadow-xl ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-neutral-300'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                  className={`p-3 rounded-full mb-4 ${
                    isDark ? 'bg-red-900/20' : 'bg-red-100'
                  }`}
                >
                  <BsTrash
                    size={24}
                    className="text-red-500"
                  />
                </motion.div>

                <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                  Clear Chat History?
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                  This will permanently delete all your chat messages with the AI. This action cannot be undone.
                </p>

                <div className="flex gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      isDark
                        ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700'
                        : 'border-neutral-400 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Clear Chat
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClearChatConfirmPopup;
