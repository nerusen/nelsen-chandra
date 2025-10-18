"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { FiUser as UserIcon } from "react-icons/fi";
import { IoClose as CloseIcon } from "react-icons/io5";

interface WelcomeNotificationProps {
  isWidget?: boolean;
}

const WelcomeNotification = ({ isWidget }: WelcomeNotificationProps) => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (session?.user && !hasShown) {
      setIsVisible(true);
      setHasShown(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [session, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!session?.user) return null;

  const userName = session.user.name || "User";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`fixed top-6 right-6 z-50 rounded-lg border backdrop-blur-md px-4 py-3 shadow-lg ${
            isWidget
              ? "w-[300px] bg-neutral-50/95 border-neutral-300 dark:bg-neutral-900/95 dark:border-neutral-600"
              : "w-[350px] bg-neutral-100/95 border-neutral-300 dark:bg-neutral-800/95 dark:border-neutral-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <UserIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Welcome, {userName}!
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                Selamat datang di chat room! Nikmati percakapan dengan komunitas kami.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Close notification"
            >
              <CloseIcon size={16} className="text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeNotification;
