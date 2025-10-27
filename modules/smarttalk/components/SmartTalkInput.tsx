"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FiSend as SendIcon } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { IoCloseCircle as CloseIcon } from "react-icons/io5";
import { BsTrash } from "react-icons/bs";

import Button from "@/common/components/elements/Button";
import ModelSelector from "./ModelSelector";

interface SmartTalkInputProps {
  onSendMessage: (message: string) => void;
  onCancelReply: () => void;
  replyName?: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onClearChat?: () => void;
}

const SmartTalkInput = ({
  onSendMessage,
  onCancelReply,
  replyName,
  selectedModel,
  onModelChange,
  onClearChat,
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
    <div className="border-t border-neutral-300 py-4 dark:border-neutral-700 px-4">
      <ModelSelector
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />

      {replyName && (
        <div className="flex items-center justify-between mb-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Replying to {replyName}
          </span>
          <CloseIcon
            size={14}
            onClick={() => onCancelReply()}
            className="cursor-pointer"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("placeholder")}
          className="flex-grow rounded-md border p-2 focus:outline-none dark:border-[#3A3A3A] dark:bg-[#1F1F1F] disabled:opacity-50"
          disabled={isCooldown}
        />
        <button
          type="submit"
          disabled={!message.trim() || isCooldown}
          className={`rounded-md p-3 text-white transition duration-100 active:scale-90 ${
            message.trim() && !isCooldown
              ? "bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              : "cursor-not-allowed bg-[#1F1F1F] border border-[#3A3A3A] active:scale-100"
          }`}
        >
          {isCooldown ? (
            <span className="text-xs">{Math.ceil(cooldownTime / 1000)}s</span>
          ) : (
            <SendIcon size={18} />
          )}
        </button>
        {onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className={`rounded-md p-3 text-white transition duration-100 active:scale-90 ${
              "bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500"
            }`}
            title="Clear Chat"
          >
            <BsTrash size={18} />
          </button>
        )}
      </form>
    </div>
  );
};

export default SmartTalkInput;
