"use client";

import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import SmartTalkAuth from "./SmartTalkAuth";
import SmartTalkInput from "./SmartTalkInput";
import SmartTalkList from "./SmartTalkList";
import SmartTalkItemSkeleton from "./SmartTalkItemSkeleton";
import ClearChatButton from "./ClearChatButton";

import { MessageProps } from "@/common/types/chat";
import { fetcher } from "@/services/fetcher";
import { createClient } from "@/common/utils/client";
import useNotif from "@/hooks/useNotif";

export const SmartTalkRoom = () => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR(
    session?.user?.email ? `/api/smart-talk?email=${session.user.email}` : null,
    fetcher
  );

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isReply, setIsReply] = useState({ is_reply: false, name: "" });
  const [showPopupFor, setShowPopupFor] = useState<string | null>(null);
  const [thinkingMessageId, setThinkingMessageId] = useState<string | null>(null);

  const supabase = createClient();

  const notif = useNotif();

  const handleClickReply = (name: string) => {
    if (!session?.user) return notif("Please sign in to reply");
    setIsReply({ is_reply: true, name });
  };

  const handleCancelReply = () => {
    setIsReply({ is_reply: false, name: "" });
  };

  const handleClearChat = async () => {
    try {
      await axios.delete("/api/smart-talk", { data: { email: session?.user?.email } });
      setMessages([]);
      notif("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
      notif("Failed to clear chat");
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!session?.user?.email) return;

    const messageId = uuidv4();
    const newMessageData = {
      id: messageId,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      message,
      is_reply: isReply.is_reply,
      reply_to: isReply.name,
      is_show: true,
      created_at: new Date().toISOString(),
      is_ai: false, // User message
    };

    // Optimistic update - add message immediately to UI
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessageData as MessageProps,
    ]);

    try {
      await axios.post("/api/smart-talk", newMessageData);
      notif("Message sent successfully");

      // Add thinking message with a short delay to simulate processing
      const thinkingId = uuidv4();
      setThinkingMessageId(thinkingId);
      const thinkingMessage = {
        id: thinkingId,
        name: "AI Assistant",
        email: "ai@smarttalk.com",
        image: "/images/satria.jpg", // AI avatar
        message: "Sedang berpikir...",
        is_reply: false,
        reply_to: undefined,
        is_show: true,
        created_at: new Date().toISOString(),
        is_ai: true,
        is_thinking: true,
      };

      // Add thinking message after a short delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          thinkingMessage as MessageProps,
        ]);
      }, 200); // 200ms delay before showing thinking message

      // Get AI response
      await getAIResponse(message, thinkingId);
    } catch (error) {
      console.error("Error:", error);
      notif("Failed to send message");
      // Remove optimistic message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
  };



  const getAIResponse = async (userMessage: string, thinkingId: string) => {
    try {
      console.log("Sending AI response request for message:", userMessage);
      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
      });

      console.log("AI response request sent successfully, response:", response.data);
      // The AI response will be handled by the real-time subscription
      // No need to manually remove thinking message here
    } catch (error) {
      console.error("Error getting AI response:", error);
      notif("Failed to get AI response");
      // Remove thinking message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== thinkingId)
      );
      setThinkingMessageId(null);
    }
  };

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Debug logging
  useEffect(() => {
    if (error) {
      console.error("Smart Talk fetch error:", error);
    }
    console.log("Smart Talk data:", data);
    console.log("Smart Talk loading:", isLoading);
  }, [data, error, isLoading]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime smart-talk")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "smart_talk_messages",
        },
        (payload) => {
          const newMessage = payload.new as MessageProps;
          console.log("New message received via real-time:", newMessage);

          // If this is an AI message and we have a thinking message, replace it
          if (newMessage.is_ai && thinkingMessageId) {
            console.log("Replacing thinking message with AI response");
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === thinkingMessageId ? newMessage : msg
              )
            );
            setThinkingMessageId(null);
          } else {
            // Regular message insertion
            console.log("Adding new message to list");
            setMessages((prevMessages) => [
              ...prevMessages,
              newMessage,
            ]);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "smart_talk_messages",
        },
        (payload) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === payload.new.id ? (payload.new as MessageProps) : msg,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, thinkingMessageId]);

  return (
    <div className="flex flex-col h-full relative">
      {isLoading ? (
        <SmartTalkItemSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <SmartTalkList
            messages={messages}
            onClickReply={handleClickReply}
            showPopupFor={showPopupFor}
          />
        </div>
      )}
      {session && messages.length > 0 && (
        <ClearChatButton
          onClear={handleClearChat}
          isVisible={true}
        />
      )}
      {session ? (
        <SmartTalkInput
          onSendMessage={handleSendMessage}
          onCancelReply={handleCancelReply}
          replyName={isReply.name}
        />
      ) : (
        <SmartTalkAuth />
      )}
    </div>
  );
};
