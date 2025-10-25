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

  const supabase = createClient();

  const notif = useNotif();

  const handleClickReply = (name: string) => {
    if (!session?.user) return notif("Please sign in to reply");
    setIsReply({ is_reply: true, name });
  };

  const handleCancelReply = () => {
    setIsReply({ is_reply: false, name: "" });
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

    try {
      await axios.post("/api/smart-talk", newMessageData);
      notif("Message sent successfully");

      // Check if this is the user's first message
      const userMessages = messages.filter(msg => msg.email === session?.user?.email && !msg.is_ai);
      if (userMessages.length === 0) {
        setShowPopupFor(messageId);
        // Send welcome message from AI
        await sendWelcomeMessage();
      }

      // Get AI response
      await getAIResponse(message);
    } catch (error) {
      console.error("Error:", error);
      notif("Failed to send message");
    }
  };

  const sendWelcomeMessage = async () => {
    if (!session?.user) return;

    const welcomeMessage = `Hello ${session.user.name}! I'm your AI assistant. I'm here to help you with any questions or just chat about interesting topics. How can I assist you today?`;

    const aiMessageData = {
      id: uuidv4(),
      name: "AI Assistant",
      email: "ai@smarttalk.com",
      image: null,
      message: welcomeMessage,
      is_reply: false,
      reply_to: null,
      is_show: true,
      created_at: new Date().toISOString(),
      is_ai: true,
    };

    try {
      await axios.post("/api/smart-talk", aiMessageData);
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
  };

  const getAIResponse = async (userMessage: string) => {
    try {
      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
      });
      // AI response will be handled by the real-time subscription
    } catch (error) {
      console.error("Error getting AI response:", error);
      notif("Failed to get AI response");
    }
  };

  useEffect(() => {
    if (data) setMessages(data);
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
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as MessageProps,
          ]);
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
  }, [supabase]);

  return (
    <div className="flex flex-col h-full">
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
