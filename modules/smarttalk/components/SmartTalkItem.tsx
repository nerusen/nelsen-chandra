import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

import { MessageProps } from "@/common/types/chat";

interface SmartTalkItemProps {
  message: MessageProps;
  isUser: boolean;
}

const SmartTalkItem = ({ message, isUser }: SmartTalkItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={clsx(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
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
            <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center text-xs font-semibold">
              AI
            </div>
            <span className="text-xs text-neutral-300">AI Assistant</span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.message}
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
    </div>
  );
};

export default SmartTalkItem;
