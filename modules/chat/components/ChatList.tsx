"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import ChatItem from "./ChatItem";
import PinnedMessagesToggle from "./PinnedMessagesToggle";
import ScrollToBottomButton from "./ScrollToBottomButton";

import { ChatListProps } from "@/common/types/chat";

interface ChatListPropsNew extends ChatListProps {
  onDeleteMessage: (id: string) => void;
  onClickReply: (name: string) => void;
  onPinMessage: (id: string, is_pinned: boolean) => void;
  onEditMessage: (id: string, message: string) => void;
  isWidget?: boolean;
  showPopupFor?: string | null;
}

const ChatList = ({
  messages,
  isWidget,
  onDeleteMessage,
  onClickReply,
  onPinMessage,
  onEditMessage,
  showPopupFor,
}: ChatListPropsNew) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [activeTogglesId, setActiveTogglesId] = useState<string | null>(null);
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
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: 'smooth',
      });
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

  // Auto-scroll to bottom on initial load or refresh
  useEffect(() => {
    if (chatListRef.current) {
      setTimeout(() => {
        chatListRef.current?.scrollTo({
          top: chatListRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100); // Small delay to ensure messages are rendered
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeTogglesId && !(event.target as Element).closest(`#message-${activeTogglesId}`)) {
        setActiveTogglesId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTogglesId]);

  return (
    <div className="relative">
      <div ref={chatListRef} className="h-96 space-y-5 overflow-y-auto py-4">
        <PinnedMessagesToggle messages={messages} isWidget={isWidget} />
        {messages
          ?.sort((a, b) => {
            // Sort by created_at (oldest first) - chronological order
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          })
          .map((chat) => (
            <div
              key={chat.id}
              id={`message-${chat.id}`}
              className={clsx(
                editingMessageId && editingMessageId !== chat.id && "blur-sm"
              )}
            >
              <ChatItem
                onDelete={onDeleteMessage}
                onReply={onClickReply}
                onPin={onPinMessage}
                onEdit={(id, message) => {
                  setEditingMessageId(id);
                  onEditMessage(id, message);
                }}
                onEditCancel={() => setEditingMessageId(null)}
                isEditing={editingMessageId === chat.id}
                isWidget={isWidget}
                showPopup={showPopupFor === chat.id}
                isTogglesVisible={activeTogglesId === chat.id}
                onToggleVisibility={(visible) => {
                  if (visible) {
                    setActiveTogglesId(chat.id);
                  } else {
                    setActiveTogglesId(null);
                  }
                }}
                {...chat}
              />
            </div>
          ))}
        <ScrollToBottomButton
          onClick={handleScrollToBottom}
          isVisible={showScrollButton}
          isWidget={isWidget}
        />
      </div>
    </div>
  );
};

export default ChatList;
