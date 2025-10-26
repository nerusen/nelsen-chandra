import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { VscHubot as SmartChatIcon } from "react-icons/vsc";

import SmartTalkItem from "./SmartTalkItem";
import ScrollToBottomButton from "./ScrollToBottomButton";
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
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (chatListRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = chatListRef.current;
        const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 5;
        const distanceFromBottom = scrollHeight - clientHeight - scrollTop;

        if (isScrolledToBottom) {
          setHasScrolledUp(false);
          setShowScrollButton(false);
        } else {
          setHasScrolledUp(true);
          setShowScrollButton(distanceFromBottom > 50);
        }
      }
    };

    chatListRef.current?.addEventListener("scroll", handleScroll);

    const currentChatListRef = chatListRef.current;

    return () => {
      currentChatListRef?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (chatListRef.current && !hasScrolledUp) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages, hasScrolledUp]);

  return (
    <div className="relative">
      <div ref={chatListRef} className="h-96 space-y-5 overflow-y-auto py-4">
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
        messages
          ?.sort((a, b) => {
            // Sort by created_at (oldest first) - chronological order
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          })
          .map((message) => {
            const isUser = message.email === session?.user?.email && !message.is_ai;
            return (
              <div
                key={message.id}
                id={`message-${message.id}`}
              >
                <SmartTalkItem
                  message={message}
                  isUser={isUser}
                />
              </div>
            );
          })
      )}
      <ScrollToBottomButton
        onClick={handleScrollToBottom}
        isVisible={showScrollButton}
      />
    </div>
  );
};

export default SmartTalkList;
