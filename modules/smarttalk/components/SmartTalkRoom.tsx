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

      // Add thinking message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        thinkingMessage as MessageProps,
      ]);

      // Get AI response - only call once
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

      // Wait a bit for the real-time subscription to handle the response
      setTimeout(() => {
        if (thinkingMessageId === thinkingId) {
          console.log("AI response not received via real-time, checking manually");
          // If still thinking after 3 seconds, check if AI response was inserted
          checkForAIResponse(thinkingId);
        }
      }, 3000);

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

  const checkForAIResponse = async (thinkingId: string) => {
    try {
      // Fetch latest messages to see if AI response was added
      const response = await axios.get(`/api/smart-talk?email=${session?.user?.email}`);
      const latestMessages = response.data;

      // Find AI messages that came after the thinking message
      const thinkingMessage = messages.find(msg => msg.id === thinkingId);
      if (thinkingMessage) {
        const aiMessages = latestMessages.filter((msg: MessageProps) =>
          msg.is_ai && new Date(msg.created_at) > new Date(thinkingMessage.created_at)
        );

        if (aiMessages.length > 0) {
          console.log("Found AI response manually:", aiMessages[0]);
          // Replace thinking message with AI response
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === thinkingId ? aiMessages[0] : msg
            )
          );
          setThinkingMessageId(null);
        }
      }
    } catch (error) {
      console.error("Error checking for AI response:", error);
    }
  };

  // Function to manually trigger AI response if real-time fails
  const triggerAIResponse = async (userMessage: string, thinkingId: string) => {
    try {
      console.log("Manually triggering AI response for:", userMessage);
      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
      });
      console.log("Manual AI response triggered:", response.data);
    } catch (error) {
      console.error("Error in manual AI response:", error);
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
      }, 30000); // 30 seconds timeout

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
      {session && messages.length > 0 && (
        <div className="relative">
          <ClearChatButton
            onClear={handleClearChat}
            isVisible={true}
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
