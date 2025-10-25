import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";

import { MessageProps } from "@/common/types/chat";

interface SmartTalkItemProps {
  message: MessageProps;
  isUser: boolean;
}

const SmartTalkItem = ({ message, isUser }: SmartTalkItemProps) => {
  const [displayedText, setDisplayedText] = useState(message.is_thinking ? "Sedang berpikir..." : message.message);
  const [isTyping, setIsTyping] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  useEffect(() => {
    if (message.is_thinking) {
      // Animate the thinking dots
      const dots = ["Sedang berpikir.", "Sedang berpikir..", "Sedang berpikir..."];
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(dots[index]);
        index = (index + 1) % dots.length;
      }, 500);
      return () => clearInterval(interval);
    } else if (message.is_ai && !message.is_thinking) {
      // Typewriter effect for AI messages
      setIsTyping(true);
      setDisplayedText("");
      let index = 0;
      const text = message.message;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30); // Adjust speed here
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.message);
    }
  }, [message.message, message.is_thinking, message.is_ai, message.id]);

  return (
    <div
      className={clsx(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex items-start space-x-2">
        {!isUser && (
          <Image
            src="/images/satria.jpg"
            alt="AI Assistant"
            width={32}
            height={32}
            className="rounded-full border-2 border-neutral-600"
          />
        )}
        <div
          className={clsx(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
            isUser
              ? "bg-neutral-700 text-white rounded-br-none"
              : "bg-neutral-800 text-white rounded-bl-none"
          )}
        >
          {!isUser && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-neutral-300 font-medium">AI Assistant</span>
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-400">{timeAgo}</span>
            {isUser && (
              <span className="text-xs text-neutral-400">
                {message.name}
              </span>
            )}
          </div>
        </div>
        {isUser && (
          <Image
            src={message.image || "/images/default-avatar.png"}
            alt={message.name}
            width={32}
            height={32}
            className="rounded-full border-2 border-neutral-600"
          />
        )}
      </div>
    </div>
  );
};

export default SmartTalkItem;
