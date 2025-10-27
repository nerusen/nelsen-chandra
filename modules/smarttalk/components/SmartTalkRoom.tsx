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
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-3.1-70b-instruct:free");

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

      // Add thinking message immediately
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

      // Add thinking message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        thinkingMessage as MessageProps,
      ]);

      // Get AI response - only call once
      await getAIResponse(message, thinkingId, selectedModel);
    } catch (error) {
      console.error("Error:", error);
      notif("Failed to send message");
      // Remove optimistic message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
  };



  const getAIResponse = async (userMessage: string, thinkingId: string, model: string) => {
    try {
      console.log("Sending AI response request for message:", userMessage);
      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
        model,
      });

      console.log("AI response request sent successfully, response:", response.data);

      // Wait for real-time subscription to handle the response
      // The real-time listener will replace the thinking message with the actual AI response

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



  // Add a timeout to remove thinking message if AI response takes too long
  useEffect(() => {
    if (thinkingMessageId) {
      const timeout = setTimeout(() => {
        console.log("AI response timeout - removing thinking message");
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== thinkingMessageId)
        );
        setThinkingMessageId(null);
        notif("AI response timed out. Please try again.");
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [thinkingMessageId, notif]);

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

  // Separate useEffect for real-time subscription setup - stable without thinkingMessageId dependency
  useEffect(() => {
    if (!session?.user?.email) return;

    console.log("Setting up real-time subscription for user:", session.user.email);

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
          console.log("Real-time INSERT received:", newMessage);

          // Filter messages for this user
          if (newMessage.user_email !== session?.user?.email) {
            console.log("Message not for this user, ignoring");
            return;
          }

          console.log("Message is for this user, processing");

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
          const updatedMessage = payload.new as MessageProps;
          console.log("Real-time UPDATE received:", updatedMessage);

          // Filter messages for this user
          if (updatedMessage.user_email !== session?.user?.email) {
            console.log("Update not for this user, ignoring");
            return;
          }

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg,
            ),
          );
        },
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [supabase, session?.user?.email]); // Removed thinkingMessageId from dependencies

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <SmartTalkItemSkeleton />
      ) : (
        <SmartTalkList
          messages={messages}
          onClickReply={handleClickReply}
          showPopupFor={showPopupFor}
        />
      )}

      {session ? (
        <SmartTalkInput
          onSendMessage={handleSendMessage}
          onCancelReply={handleCancelReply}
          replyName={isReply.name}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onClearChat={handleClearChat}
        />
      ) : (
        <SmartTalkAuth />
      )}
    </div>
  );
};
