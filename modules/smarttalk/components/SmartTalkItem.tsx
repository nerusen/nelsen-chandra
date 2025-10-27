import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

import { MessageProps } from "@/common/types/chat";

interface SmartTalkItemProps {
  message: MessageProps;
  isUser: boolean;
}

const SmartTalkItem = ({ message, isUser }: SmartTalkItemProps) => {
  const [displayedText, setDisplayedText] = useState(message.is_thinking ? "Sedang berpikir..." : message.message);
  const [showThinking, setShowThinking] = useState(false);

  // Extract thinking content from message
  const thinkingMatch = message.message.match(/<think>([\s\S]*?)<\/think>/);
  const thinkingContent = thinkingMatch ? thinkingMatch[1] : null;
  const cleanMessage = message.message.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  useEffect(() => {
    if (message.is_thinking) {
      // Animate the thinking dots
      const dots = ["Sedang berpikir.", "Sedang berpikir..", "Sedang berpikir..."];
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(dots[index]);
        index = (index + 1) % dots.length;
      }, 500);
      return () => clearInterval(interval);
    } else {
      // Display message directly without typewriter effect
      setDisplayedText(cleanMessage);
    }
  }, [message.message, message.is_thinking, message.is_ai, message.id, cleanMessage]);

  return (
    <div
      className={clsx(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex items-start space-x-2">
        {!isUser && (
          <Image
            src="/images/satria.jpg"
            alt="AI Assistant"
            width={32}
            height={32}
            className="rounded-full border-2 border-neutral-600"
          />
        )}
        <div
          className={clsx(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
            isUser
              ? "bg-neutral-700 text-white rounded-br-none"
              : "bg-neutral-800 text-white rounded-bl-none"
          )}
        >
          {!isUser && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-neutral-300 font-medium">AI Assistant</span>
            </div>
          )}
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !className || !match;
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md text-xs"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-neutral-600 px-1 py-0.5 rounded text-xs font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                strong({ children }) {
                  return <strong className="font-semibold text-neutral-100">{children}</strong>;
                },
                em({ children }) {
                  return <em className="italic text-neutral-200">{children}</em>;
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-neutral-200">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-neutral-500 pl-4 italic text-neutral-300 my-2">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {displayedText}
            </ReactMarkdown>

            {/* Thinking content toggle */}
            {thinkingContent && !message.is_thinking && (
              <div className="mt-3">
                <button
                  onClick={() => setShowThinking(!showThinking)}
                  className="flex items-center space-x-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-md text-xs text-neutral-300 hover:text-neutral-200 transition-colors border border-neutral-600"
                >
                  <span>Think</span>
                  {showThinking ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                </button>

                {showThinking && (
                  <div className="mt-2 p-3 bg-neutral-900 rounded-md border border-neutral-700 text-xs text-neutral-400">
                    <div className="whitespace-pre-wrap">{thinkingContent}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-400">{timeAgo}</span>
            {isUser && (
              <span className="text-xs text-neutral-400">
                {message.name}
              </span>
            )}
          </div>
        </div>
        {isUser && (
          <Image
            src={message.image || "/images/default-avatar.png"}
            alt={message.name}
            width={32}
            height={32}
            className="rounded-full border-2 border-neutral-600"
          />
        )}
      </div>
    </div>
  );
};

export default SmartTalkItem;
