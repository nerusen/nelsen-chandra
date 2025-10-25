"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

import Button from "@/common/components/elements/Button";

interface SmartTalkInputProps {
  onSendMessage: (message: string) => void;
  onCancelReply: () => void;
  replyName?: string;
}

const SmartTalkInput = ({
  onSendMessage,
  onCancelReply,
  replyName,
}: SmartTalkInputProps) => {
  const [message, setMessage] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const t = useTranslations("ChatRoomPage");

  const COOLDOWN_DURATION = 3000; // 3 seconds cooldown

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCooldown && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1000) {
            setIsCooldown(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCooldown, cooldownTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isCooldown) return;

    onSendMessage(message.trim());
    setMessage("");
    setIsCooldown(true);
    setCooldownTime(COOLDOWN_DURATION);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
      {replyName && (
        <div className="flex items-center justify-between mb-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Replying to {replyName}
          </span>
          <Button
            onClick={onCancelReply}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <MdCancel size={16} />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("placeholder")}
            className="w-full resize-none rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-neutral-500 dark:focus:border-neutral-400 focus:outline-none"
            rows={1}
            disabled={isCooldown}
          />
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isCooldown}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !message.trim() || isCooldown
              ? "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              : "bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-200"
          }`}
        >
          {isCooldown ? (
            <span className="text-xs">{Math.ceil(cooldownTime / 1000)}s</span>
          ) : (
            <FiSend size={16} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default SmartTalkInput;
