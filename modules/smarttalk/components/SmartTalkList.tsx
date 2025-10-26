import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { VscHubot as SmartChatIcon } from "react-icons/vsc";

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
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [chatListHeight, setChatListHeight] = useState('500px');

  useEffect(() => {
    const handleScroll = () => {
      if (chatListRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = chatListRef.current;
        const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 5;

        if (isScrolledToBottom) {
          setHasScrolledUp(false);
        } else {
          setHasScrolledUp(true);
        }
      }
    };

    chatListRef.current?.addEventListener("scroll", handleScroll);

    const currentChatListRef = chatListRef.current;

    return () => {
      currentChatListRef?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = `${window.innerHeight - 360}px`;
      setChatListHeight(newHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (chatListRef.current && !hasScrolledUp) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages, hasScrolledUp]);

  return (
    <div ref={chatListRef} className="overflow-y-auto p-4 space-y-4" style={{ height: chatListHeight }}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center space-y-4">
            <SmartChatIcon size={64} className="mx-auto text-neutral-400 dark:text-neutral-500" />
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
