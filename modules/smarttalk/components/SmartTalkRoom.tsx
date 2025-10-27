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
    session?.user?.email ? `/api/smart-talk?email=${session?.user?.email}` : null,
    fetcher
  );

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isReply, setIsReply] = useState({ is_reply: false, name: "" });
  const [showPopupFor, setShowPopupFor] = useState<string | null>(null);
  const [thinkingMessageId, setThinkingMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("minimax/minimax-01");

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

  // Enhanced real-time subscription with better error handling and fallback polling
  useEffect(() => {
    if (!session?.user?.email) return;

    console.log("🔄 Setting up enhanced real-time subscription for user:", session?.user?.email);

    // Test Supabase connection first
    supabase
      .from('smart_talk_messages')
      .select('count', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('❌ Supabase connection test failed:', error);
        } else {
          console.log('✅ Supabase connection test passed, message count:', count);
        }
      });

    let channel: any = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const maxRetries = 5; // Increased retries

    const setupSubscription = () => {
      // Create unique channel name to avoid conflicts
      const channelName = `realtime-smart-talk-${session?.user?.email}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
            console.log("📨 Real-time INSERT received:", {
              id: newMessage.id,
              is_ai: newMessage.is_ai,
              user_email: newMessage.user_email,
              message: newMessage.message?.substring(0, 50) + "..."
            });

            // Double-check user filtering (belt and suspenders)
            if (newMessage.user_email !== session?.user?.email) {
              console.log("🚫 Message not for this user, ignoring");
              return;
            }

            console.log("✅ Message is for this user, processing");

            // If this is an AI message and we have a thinking message, replace it
            if (newMessage.is_ai && thinkingMessageId) {
              console.log("🔄 Replacing thinking message with AI response");
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === thinkingMessageId ? newMessage : msg
                )
              );
              setThinkingMessageId(null);
              console.log("✅ AI response successfully displayed");
            } else if (!newMessage.is_ai) {
              // Regular user message insertion
              console.log("💬 Adding new user message to list");
              setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
              ]);
            } else {
              // AI message without thinking state (shouldn't happen but handle it)
              console.log("🤖 Adding AI message without thinking state");
              setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
              ]);
            }
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

            if (updatedMessage.user_email !== session?.user?.email) {
              console.log("🚫 Update not for this user, ignoring");
              return;
            }

            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            );
          },
        )
        .subscribe((status, err) => {
          console.log("🔗 Real-time subscription status:", status, err ? `Error: ${err?.message || err}` : "");

          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to real-time');
            retryCount = 0; // Reset retry count on success
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
              console.log('🛑 Stopped polling since real-time is working');
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error('❌ Real-time subscription failed:', status, err);

            // Log detailed error information
            if (err) {
              console.error('❌ Detailed error:', {
                message: err.message,
                details: err.details,
                hint: err.hint,
                code: err.code
              });
            }

            // Fallback to polling if real-time fails
            if (!pollInterval && retryCount < maxRetries) {
              console.log('🔄 Falling back to polling...');
              pollInterval = setInterval(async () => {
                try {
                  if (session?.user?.email && thinkingMessageId) {
                    console.log('🔍 Polling for AI response...');
                    const response = await fetch(`/api/smart-talk?email=${session?.user?.email}`);
                    const data = await response.json();

                    // Find recent AI response (within last 45 seconds to match timeout)
                    const aiResponse = data.find((msg: MessageProps) =>
                      msg.is_ai && new Date(msg.created_at) > new Date(Date.now() - 45000)
                    );

                    if (aiResponse) {
                      console.log('🎯 Found AI response via polling, replacing thinking message');
                      setMessages(prev => prev.map(msg =>
                        msg.id === thinkingMessageId ? aiResponse : msg
                      ));
                      setThinkingMessageId(null);
                      if (pollInterval) {
                        clearInterval(pollInterval);
                        pollInterval = null;
                        console.log('🛑 Stopped polling after finding AI response');
                      }
                    }
                  }
                } catch (error) {
                  console.error('❌ Polling error:', error);
                }
              }, 2000); // Poll every 2 seconds (faster)
            }

            // Retry subscription with exponential backoff
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
              console.log(`🔄 Retrying subscription (${retryCount}/${maxRetries}) in ${delay}ms...`);
              setTimeout(() => {
                if (channel) {
                  supabase.removeChannel(channel);
                  channel = null;
                }
                setupSubscription();
              }, delay);
            } else {
              console.error('💀 Max retries reached, real-time subscription failed permanently');
            }
          }
        });
    };

    // Add a small delay before setting up subscription to ensure component is fully mounted
    const initTimeout = setTimeout(() => {
      setupSubscription();
    }, 100);

    return () => {
      console.log("🧹 Cleaning up real-time subscription and polling");
      clearTimeout(initTimeout);
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [supabase, session?.user?.email]); // Stable dependencies

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
