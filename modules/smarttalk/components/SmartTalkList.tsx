import { useSession } from "next-auth/react";

import SmartTalkItem from "./SmartTalkItem";
import { MessageProps } from "@/common/types/chat";

interface SmartTalkListProps {
  messages: MessageProps[];
  onClickReply: (name: string) => void;
  showPopupFor?: string | null;
}

const SmartTalkList = ({
  messages,
  onClickReply,
  showPopupFor,
}: SmartTalkListProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              No messages yet. Start a conversation!
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isUser = message.email === session?.user?.email && !message.is_ai;
          return (
            <SmartTalkItem
              key={message.id}
              message={message}
              isUser={isUser}
            />
          );
        })
      )}
    </div>
  );
};

export default SmartTalkList;
