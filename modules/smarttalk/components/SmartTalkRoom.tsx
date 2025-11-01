"use client";

import useSWR, { mutate } from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import SmartTalkAuth from "./SmartTalkAuth";
import SmartTalkInput from "./SmartTalkInput";
import SmartTalkList from "./SmartTalkList";
import SmartTalkItemSkeleton from "./SmartTalkItemSkeleton";
import ClearChatConfirmPopup from "./ClearChatConfirmPopup";

import { MessageProps } from "@/common/types/chat";
import { fetcher } from "@/services/fetcher";
import { createClient } from "@/common/utils/client";
import useNotif from "@/hooks/useNotif";

export const SmartTalkRoom = () => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR(
    session?.user?.email ? `/api/smart-talk?email=${session?.user?.email}` : null,
    fetcher
  );

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isReply, setIsReply] = useState({ is_reply: false, name: "" });
  const [showPopupFor, setShowPopupFor] = useState<string | null>(null);
  const [thinkingMessageId, setThinkingMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("minimax/minimax-01");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const supabase = createClient();

  const notif = useNotif();

  const handleClickReply = (name: string) => {
    if (!session?.user) return notif("Please sign in to reply");
    setIsReply({ is_reply: true, name });
  };

  const handleCancelReply = () => {
    setIsReply({ is_reply: false, name: "" });
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClearChat = () => {
    setMessages([]);
    setShowClearConfirm(false);
    // Invalidate SWR cache to refresh data
    mutate(`/api/smart-talk?email=${session?.user?.email}`);
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
      // Also remove thinking message on error
      if (thinkingMessageId) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== thinkingMessageId)
        );
        setThinkingMessageId(null);
      }
    }
  };



  const getAIResponse = async (userMessage: string, thinkingId: string, model: string) => {
    try {
      console.log("Sending AI response request for message:", userMessage);
      console.log("Request payload:", {
        userMessage: userMessage.substring(0, 50) + "...",
        email: session?.user?.email,
        model,
        thinkingId
      });

      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
        model,
      });

      console.log("AI response request sent successfully, response:", response.data);

      // Wait for real-time subscription to handle the response
      // The real-time listener will replace the thinking message with the actual AI response

      // Add a fallback: if no real-time response after 10 seconds, poll once
      setTimeout(async () => {
        if (thinkingMessageId === thinkingId) { // Still thinking after 10 seconds
          console.log("🔄 Fallback: Polling for AI response after 10 seconds...");
          try {
            const pollResponse = await fetch(`/api/smart-talk?email=${session?.user?.email}`);
            const data = await pollResponse.json();

            // Find the most recent AI message
            const aiResponse = data
              .filter((msg: MessageProps) => msg.is_ai)
              .sort((a: MessageProps, b: MessageProps) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0];

            if (aiResponse && thinkingMessageId === thinkingId) {
              console.log("🎯 Found AI response via fallback polling, replacing thinking message");
              setMessages(prev => prev.map(msg =>
                msg.id === thinkingId ? aiResponse : msg
              ));
              setThinkingMessageId(null);
            }
          } catch (error) {
            console.error("❌ Fallback polling error:", error);
          }
        }
      }, 10000); // 10 seconds fallback

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
      }, 45000); // Reduced to 45 seconds for better UX

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

  // Simplified real-time subscription with immediate UI updates
  useEffect(() => {
    if (!session?.user?.email) return;

    console.log("🔄 Setting up real-time subscription for user:", session?.user?.email);

    let channel: any = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const setupSubscription = () => {
      const channelName = `smart-talk-${session?.user?.email}-${Date.now()}`;

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "smart_talk_messages",
            filter: `user_email=eq.${session?.user?.email}`,
          },
          (payload) => {
            console.log("📨 Real-time INSERT received:", payload);
            const newMessage = payload.new as MessageProps;

            // Force immediate state update using functional setState
            setMessages(prevMessages => {
              // If this is an AI message and we have a thinking message, replace it
              if (newMessage.is_ai && thinkingMessageId) {
                console.log("🔄 Replacing thinking message with AI response");
                const updatedMessages = prevMessages.map(msg =>
                  msg.id === thinkingMessageId ? { ...newMessage } : msg
                );
                setThinkingMessageId(null);
                console.log("✅ AI response successfully displayed");
                return updatedMessages;
              } else {
                // Add new message to the list
                console.log("💬 Adding new message to list");
                return [...prevMessages, { ...newMessage }];
              }
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "smart_talk_messages",
            filter: `user_email=eq.${session?.user?.email}`,
          },
          (payload) => {
            const updatedMessage = payload.new as MessageProps;
            console.log("🔄 Real-time UPDATE received:", updatedMessage.id);

            setMessages(prevMessages =>
              prevMessages.map(msg =>
                msg.id === updatedMessage.id ? { ...updatedMessage } : msg
              )
            );
          }
        )
        .subscribe((status, err) => {
          console.log("🔗 Subscription status:", status, err ? `Error: ${err?.message || err}` : "");

          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to real-time');
            retryCount = 0;
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error('❌ Subscription failed:', status, err);

            // Simple fallback polling for AI responses
            if (!pollInterval && retryCount < maxRetries) {
              console.log('🔄 Starting fallback polling...');
              pollInterval = setInterval(async () => {
                if (thinkingMessageId) {
                  try {
                    const response = await fetch(`/api/smart-talk?email=${session?.user?.email}`);
                    const data = await response.json();

                    const aiResponse = data.find((msg: MessageProps) =>
                      msg.is_ai && new Date(msg.created_at) > new Date(Date.now() - 30000)
                    );

                    if (aiResponse) {
                      console.log('🎯 Found AI response via polling');
                      setMessages(prev => prev.map(msg =>
                        msg.id === thinkingMessageId ? aiResponse : msg
                      ));
                      setThinkingMessageId(null);
                      if (pollInterval) {
                        clearInterval(pollInterval);
                        pollInterval = null;
                      }
                    }
                  } catch (error) {
                    console.error('❌ Polling error:', error);
                  }
                }
              }, 3000);
            }

            // Retry subscription
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.min(2000 * retryCount, 10000);
              console.log(`🔄 Retrying subscription (${retryCount}/${maxRetries}) in ${delay}ms...`);
              setTimeout(() => {
                if (channel) {
                  supabase.removeChannel(channel);
                  channel = null;
                }
                setupSubscription();
              }, delay);
            }
          }
        });
    };

    // Setup subscription immediately
    setupSubscription();

    return () => {
      console.log("🧹 Cleaning up subscription");
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
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

      <ClearChatConfirmPopup
        isVisible={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClearChat}
      />
    </div>
  );
};
