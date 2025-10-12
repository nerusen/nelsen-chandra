"use client";

import { useEffect, useRef, useState } from "react";

import ChatItem from "./ChatItem";
import PinnedMessagesToggle from "./PinnedMessagesToggle";
import ScrollToBottomButton from "./ScrollToBottomButton";

import { ChatListProps } from "@/common/types/chat";

interface ChatListPropsNew extends ChatListProps {
  onDeleteMessage: (id: string) => void;
  onClickReply: (name: string) => void;
  onPinMessage: (id: string, is_pinned: boolean) => void;
  isWidget?: boolean;
}

const ChatList = ({
  messages,
  isWidget,
  onDeleteMessage,
  onClickReply,
  onPinMessage,
}: ChatListPropsNew) => {
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [chatListHeight, setChatListHeight] = useState('500px');

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

  useEffect(() => {
    const handleResize = () => {
      const newHeight = isWidget ? '500px' : `${window.innerHeight - 360}px`;
      setChatListHeight(newHeight);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isWidget]);

  return (
    <div ref={chatListRef} className="h-96 space-y-5 overflow-y-auto py-4">
      <PinnedMessagesToggle messages={messages} isWidget={isWidget} />
      {messages
        ?.sort((a, b) => {
          // Sort by created_at (oldest first) - chronological order
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        })
        .map((chat) => (
          <div key={chat.id} id={`message-${chat.id}`}>
            <ChatItem
              onDelete={onDeleteMessage}
              onReply={onClickReply}
              onPin={onPinMessage}
              isWidget={isWidget}
              {...chat}
            />
          </div>
        ))}
      <ScrollToBottomButton
        onClick={handleScrollToBottom}
        isVisible={showScrollButton}
      />
    </div>
  );
};

export default ChatList;
