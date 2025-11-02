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

    console.log("🚀 Starting to send message:", message.substring(0, 50) + "...");

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
      user_email: session.user.email, // Important for filtering
    };

    console.log("📝 Adding user message to UI:", messageId);

    // Optimistic update - add message immediately to UI
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessageData as MessageProps,
    ]);

    try {
      console.log("📡 Sending message to API...");
      const response = await axios.post("/api/smart-talk", newMessageData);
      console.log("✅ Message sent successfully:", response.data);
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
        user_email: session.user.email, // Important for filtering
      };

      console.log("🤔 Adding thinking message to UI:", thinkingId);

      // Add thinking message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        thinkingMessage as MessageProps,
      ]);

      // Get AI response - only call once
      console.log("🤖 Requesting AI response...");
      await getAIResponse(message, thinkingId, selectedModel);
    } catch (error) {
      console.error("❌ Error sending message:", error);
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
      console.log("🤖 Sending AI response request for message:", userMessage.substring(0, 50) + "...");
      console.log("📋 Request payload:", {
        userMessage: userMessage.substring(0, 50) + "...",
        email: session?.user?.email,
        model,
        thinkingId
      });

      const response = await axios.post("/api/smart-talk", {
        userMessage,
        email: session?.user?.email,
        model,
        thinkingId // Pass thinkingId for tracking
      });

      console.log("✅ AI response request sent successfully, response:", response.data);

      // Wait for real-time subscription to handle the response
      // The real-time listener will replace the thinking message with the actual AI response

      // Add a fallback: if no real-time response after 3 seconds, poll
      setTimeout(async () => {
        if (thinkingMessageId === thinkingId) { // Still thinking after 3 seconds
          console.log("🔄 Fallback: Polling for AI response after 3 seconds...");
          try {
            const pollResponse = await fetch(`/api/smart-talk?email=${session?.user?.email}`);
            const data = await pollResponse.json();

            // Find the most recent AI message (within last 60 seconds)
            const aiResponse = data
              .filter((msg: MessageProps) => msg.is_ai && new Date(msg.created_at) > new Date(Date.now() - 60000))
              .sort((a: MessageProps, b: MessageProps) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0];

            if (aiResponse && thinkingMessageId === thinkingId) {
              console.log("🎯 Found AI response via fallback polling, replacing thinking message");
              console.log("📄 AI Response content:", aiResponse.message?.substring(0, 100) + "...");
              setMessages(prev => prev.map(msg =>
                msg.id === thinkingId ? { ...aiResponse, is_thinking: false } : msg
              ));
              setThinkingMessageId(null);
              console.log("✅ AI response displayed via early polling fallback");
            } else {
              console.log("❓ No recent AI response found in early polling");
            }
          } catch (error) {
            console.error("❌ Early fallback polling error:", error);
          }
        }
      }, 3000); // 3 seconds fallback (even faster)

    } catch (error) {
      console.error("❌ Error getting AI response:", error);
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

  // Force refresh mechanism for AI responses - backend refresh without UI disruption
  const forceRefreshMessages = async () => {
    if (!session?.user?.email) return;

    try {
      console.log("🔄 Force refreshing messages from backend...");
      const response = await fetch(`/api/smart-talk?email=${session?.user?.email}&t=${Date.now()}`);
      const freshData = await response.json();

      // Only update if we have new data and there's a thinking message
      if (freshData && Array.isArray(freshData) && thinkingMessageId) {
        const aiResponse = freshData
          .filter((msg: MessageProps) => msg.is_ai && new Date(msg.created_at) > new Date(Date.now() - 120000)) // Last 2 minutes
          .sort((a: MessageProps, b: MessageProps) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

        if (aiResponse) {
          console.log("🎯 Force refresh found AI response, replacing thinking message");
          setMessages((prevMessages: MessageProps[]) => prevMessages.map((msg: MessageProps) =>
            msg.id === thinkingMessageId ? { ...aiResponse, is_thinking: false } : msg
          ));
          setThinkingMessageId(null);
          console.log("✅ AI response displayed via force refresh");
          return true; // Success
        }
      }
      return false; // No update needed
    } catch (error) {
      console.error("❌ Force refresh error:", error);
      return false;
    }
  };

  // Enhanced real-time subscription with force refresh fallback
  useEffect(() => {
    if (!session?.user?.email) return;

    console.log("🔄 Setting up enhanced real-time subscription with force refresh for user:", session?.user?.email);

    let channel: any = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let forceRefreshInterval: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const maxRetries = 5;

    const setupSubscription = () => {
      // Create unique channel name to avoid conflicts
      const channelName = `smart-talk-${session?.user?.email}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("📡 Creating channel:", channelName);

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
          (payload: any) => {
            console.log("📨 Real-time INSERT received:", {
              id: payload.new.id,
              is_ai: payload.new.is_ai,
              user_email: payload.new.user_email,
              message: payload.new.message?.substring(0, 50) + "...",
              created_at: payload.new.created_at,
              thinkingMessageId: thinkingMessageId
            });

            const newMessage = payload.new as MessageProps;

            // Double-check user filtering
            if (newMessage.user_email !== session?.user?.email) {
              console.log("🚫 Message not for this user, ignoring", {
                expected: session?.user?.email,
                received: newMessage.user_email
              });
              return;
            }

            console.log("✅ Message is for this user, processing");

            // Force immediate state update using functional setState
            setMessages((prevMessages: MessageProps[]) => {
              console.log("🔄 Updating messages state:", {
                currentLength: prevMessages.length,
                isAiMessage: newMessage.is_ai,
                hasThinkingId: !!thinkingMessageId,
                thinkingId: thinkingMessageId,
                newMessageId: newMessage.id
              });

              // If this is an AI message and we have a thinking message, replace it
              if (newMessage.is_ai && thinkingMessageId) {
                console.log("🔄 Replacing thinking message with AI response");
                const updatedMessages = prevMessages.map((msg: MessageProps) => {
                  if (msg.id === thinkingMessageId) {
                    console.log("✅ Found thinking message to replace with:", newMessage.message?.substring(0, 50) + "...");
                    return { ...newMessage, is_thinking: false };
                  }
                  return msg;
                });
                setThinkingMessageId(null);
                console.log("✅ AI response successfully displayed immediately via real-time");
                return updatedMessages;
              } else if (!newMessage.is_ai) {
                // Add new user message to the list (shouldn't happen via real-time, but handle it)
                console.log("💬 Adding new user message to list via real-time");
                return [...prevMessages, { ...newMessage }];
              } else {
                // AI message without thinking state - add it normally
                console.log("🤖 Adding AI message without thinking state via real-time");
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
          (payload: any) => {
            const updatedMessage = payload.new as MessageProps;
            console.log("🔄 Real-time UPDATE received:", updatedMessage.id);

            if (updatedMessage.user_email !== session?.user?.email) {
              console.log("🚫 Update not for this user, ignoring");
              return;
            }

            setMessages((prevMessages: MessageProps[]) =>
              prevMessages.map((msg: MessageProps) =>
                msg.id === updatedMessage.id ? { ...updatedMessage } : msg
              )
            );
          }
        )
        .subscribe((status: string, err: any) => {
          console.log("🔗 Subscription status:", status, err ? `Error: ${err?.message || err}` : "");

          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to real-time');
            retryCount = 0;
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
              console.log('🛑 Stopped polling since real-time is working');
            }
            if (forceRefreshInterval) {
              clearInterval(forceRefreshInterval);
              forceRefreshInterval = null;
              console.log('🛑 Stopped force refresh since real-time is working');
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error('❌ Subscription failed:', status, err);
            console.error('❌ Error details:', {
              status,
              message: err?.message || err,
              code: err?.code,
              details: err?.details,
              hint: err?.hint
            });

            // Start force refresh immediately on subscription failure
            if (!forceRefreshInterval) {
              console.log('🔄 Starting force refresh due to subscription failure...');
              forceRefreshInterval = setInterval(async () => {
                if (thinkingMessageId) {
                  await forceRefreshMessages();
                }
              }, 2000); // Force refresh every 2 seconds
            }

            // Also start polling as additional fallback
            if (!pollInterval) {
              console.log('🔄 Starting polling fallback...');
              pollInterval = setInterval(async () => {
                if (thinkingMessageId) {
                  try {
                    console.log('🔍 Polling for AI response (fallback)...');
                    const response = await fetch(`/api/smart-talk?email=${session?.user?.email}`);
                    const data = await response.json();

                    // Find recent AI response (within last 45 seconds)
                    const aiResponse = data.find((msg: MessageProps) =>
                      msg.is_ai && new Date(msg.created_at) > new Date(Date.now() - 45000)
                    );

                    if (aiResponse) {
                      console.log('🎯 Found AI response via polling, replacing thinking message');
                      setMessages((prev: MessageProps[]) => prev.map((msg: MessageProps) =>
                        msg.id === thinkingMessageId ? { ...aiResponse, is_thinking: false } : msg
                      ));
                      setThinkingMessageId(null);
                      console.log('✅ AI response displayed via polling fallback');
                    }
                  } catch (error) {
                    console.error('❌ Polling error:', error);
                  }
                }
              }, 3000); // Poll every 3 seconds
            }

            // Try to reconnect subscription
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.min(2000 * retryCount, 30000); // Max 30 seconds
              console.log(`🔄 Retrying subscription (${retryCount}/${maxRetries}) in ${delay}ms...`);
              setTimeout(() => {
                if (channel) {
                  console.log('🧹 Cleaning up failed channel...');
                  supabase.removeChannel(channel);
                  channel = null;
                }
                console.log('🔄 Attempting to setup subscription again...');
                setupSubscription();
              }, delay);
            } else {
              console.error('💀 Max retries reached, relying on force refresh and polling fallback only');
            }
          }
        });
    };

    // Setup subscription immediately
    setupSubscription();

    return () => {
      console.log("🧹 Cleaning up enhanced real-time subscription");
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (forceRefreshInterval) {
        clearInterval(forceRefreshInterval);
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

      <ClearChatConfirmPopup
        isVisible={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClearChat}
      />
    </div>
  );
};
