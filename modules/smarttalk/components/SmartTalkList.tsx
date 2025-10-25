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
    <div className="h-full p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="text-6xl">💬</div>
            <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
              Welcome to Smart Talk
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
              Start a conversation with our AI assistant. Ask questions, get help, or just chat!
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
