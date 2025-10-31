import Image from "next/image";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { MdCode as AdminIcon } from "react-icons/md";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { FiTrash2 as DeleteIcon } from "react-icons/fi";
import { BsFillReplyAllFill as ReplyIcon } from "react-icons/bs";
import { BsPinAngleFill as PinIcon } from "react-icons/bs";
import { MdEdit as EditIcon } from "react-icons/md";
import { IoInformationCircle as InfoIcon } from "react-icons/io5";
import { IoClose as CloseIcon } from "react-icons/io5";

import ChatTime from "./ChatTime";
import MessageRenderer from "./MessageRenderer";

import Tooltip from "@/common/components/elements/Tooltip";
import { MessageProps } from "@/common/types/chat";

interface ChatItemProps extends MessageProps {
  isWidget?: boolean;
  onDelete: (id: string) => void;
  onReply: (name: string) => void;
  onPin: (id: string, is_pinned: boolean) => void;
  onEdit: (id: string, message: string) => void;
  onEditCancel?: () => void;
  isEditing?: boolean;
  showPopup?: boolean;
  isTogglesVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
}

const ChatItem = ({
  id,
  name,
  email,
  image,
  message,
  created_at,
  reply_to,
  is_reply,
  is_pinned,
  isWidget,
  onDelete,
  onReply,
  onPin,
  onEdit,
  onEditCancel,
  isEditing,
  showPopup,
  isTogglesVisible: externalIsTogglesVisible,
  onToggleVisibility,
}: ChatItemProps) => {
  const [isHover, setIsHover] = useState(false);
  const [internalIsTogglesVisible, setInternalIsTogglesVisible] = useState(false);
  const [editMessage, setEditMessage] = useState(message);
  const [isPopupVisible, setIsPopupVisible] = useState(showPopup || false);

  const isTogglesVisible = externalIsTogglesVisible !== undefined ? externalIsTogglesVisible : internalIsTogglesVisible;

  // Reset editMessage when message changes or when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditMessage(message);
    }
  }, [message, isEditing]);

  // Handle popup visibility based on showPopup prop
  useEffect(() => {
    if (showPopup) {
      setIsPopupVisible(true);
    }
  }, [showPopup]);
  const { data: session } = useSession();

  const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL;
  const isAuthor = email === authorEmail;
  const isOwnMessage = session?.user?.email === email;
  const isCurrentUserAuthor = session?.user?.email === authorEmail;

  const condition = isAuthor && !isWidget;

  const handleEditSave = () => {
    if (editMessage.trim()) {
      onEdit(id, editMessage);
      onEditCancel?.();
      setIsHover(false); // Reset hover state after edit
    }
  };

  const handleEditCancel = () => {
    setEditMessage(message);
    onEditCancel?.();
    setIsHover(false); // Reset hover state after cancel
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 lg:px-8",
        condition && "flex-row-reverse",
      )}
    >
      {isPopupVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-2 left-2 z-10 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-sm bg-neutral-100/90 dark:bg-neutral-800/90 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200"
        >
          <div className="flex items-center gap-2">
            <InfoIcon size={16} className="text-blue-500 flex-shrink-0" />
            <span className="text-xs">You can delete and edit your messages.</span>
            <button
              onClick={() => setIsPopupVisible(false)}
              className="ml-auto p-0.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
              aria-label="Close popup"
            >
              <CloseIcon size={12} />
            </button>
          </div>
        </motion.div>
      )}
      {image && (
        <Image
          src={image}
          width={40}
          height={40}
          alt={name}
          className="mt-1 rounded-full border dark:border-neutral-800"
        />
      )}

      <div
        className={clsx("space-y-1", condition && "flex flex-col items-end")}
      >
        <div
          className={clsx(
            "flex flex-col md:flex-row md:items-center gap-x-2 gap-y-1",
            condition && "md:flex-row-reverse",
          )}
        >
          <div className="flex items-center gap-x-2">
            {condition && (
              <>
                <div className="flex items-center gap-[2px] rounded-full bg-teal-500/20 px-1.5 py-0.5 font-medium text-teal-300 ">
                  <AdminIcon size={13} />
                  <span className="text-[10px]">Dev</span>
                </div>
                <div className="flex items-center gap-[2px] rounded-full bg-blue-500/20 px-1.5 py-0.5 font-medium text-blue-400 ">
                  <VerifiedIcon size={13} />
                  <span className="text-[10px]">Verified</span>
                </div>
              </>
            )}
            <div className="text-sm dark:text-neutral-200">{name}</div>
          </div>
          <div className="hidden md:flex">
            <ChatTime datetime={created_at} />
          </div>
        </div>
        <div
          className={clsx(
            "group flex w-fit items-center gap-3",
            condition && "flex-row-reverse",
          )}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={(e) => {
            e.stopPropagation();
            const newVisibility = !isTogglesVisible;
            if (onToggleVisibility) {
              onToggleVisibility(newVisibility);
            } else {
              setInternalIsTogglesVisible(newVisibility);
            }
          }}
        >
          <motion.div
            className={clsx(
              "rounded-xl px-4 relative overflow-visible",
              condition
                ? "author-gradient-border"
                : "bg-neutral-200 dark:bg-[#1E1E1E] dark:text-neutral-50",
              isEditing && "blur-none",
            )}
            animate={{
              paddingTop: "0.5rem",
              paddingBottom: isTogglesVisible ? "3rem" : "0.5rem",
              minWidth: isTogglesVisible ? "280px" : "auto",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded px-2 py-1 text-sm opacity-50"
                  placeholder="Edit your message..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditSave();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      handleEditCancel();
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleEditCancel}
                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-500 transition duration-100 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-md hover:bg-emerald-400 transition duration-100 active:scale-95"
                    disabled={!editMessage.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                {is_reply && (
                  <>
                    <span className="text-blue-500">@{reply_to} </span>
                    <MessageRenderer message={message} />
                    {is_pinned && <span className="text-xs text-neutral-700 font-medium ml-2 flex items-center gap-1"><PinIcon size={12} /> Pinned</span>}
                  </>
                )}
                {!is_reply && <><MessageRenderer message={message} />{is_pinned && <span className="text-xs text-neutral-700 font-medium ml-2 flex items-center gap-1"><PinIcon size={12} /> Pinned</span>}</>}
              </>
            )}

            <AnimatePresence>
              {isTogglesVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#212121] rounded-full px-1 sm:px-2 py-1 flex items-center gap-1 shadow-lg z-5 min-w-max"
                >
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1, delay: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(name);
                    }}
                    className="bg-[#121212] rounded-full p-1.5 sm:p-2 text-white hover:bg-[#1a1a1a] transition duration-100 active:scale-90 flex items-center justify-center"
                  >
                    <Tooltip title="Reply">
                      <ReplyIcon
                        size={14}
                        className={clsx(
                          "transition duration-300",
                          condition && "scale-x-[-1]",
                        )}
                      />
                    </Tooltip>
                  </motion.button>

                  {(isOwnMessage || isCurrentUserAuthor) && !isEditing && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1, delay: 0.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(id, message);
                      }}
                      className="bg-[#121212] rounded-full p-1.5 sm:p-2 text-white hover:bg-[#1a1a1a] transition duration-100 active:scale-90 flex items-center justify-center"
                    >
                      <Tooltip title="Edit Message">
                        <EditIcon size={14} />
                      </Tooltip>
                    </motion.button>
                  )}

                  {isCurrentUserAuthor && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1, delay: 0.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPin(id, !is_pinned);
                      }}
                      className="bg-[#121212] rounded-full p-1.5 sm:p-2 text-white hover:bg-[#1a1a1a] transition duration-100 active:scale-90 flex items-center justify-center"
                    >
                      <Tooltip title={is_pinned ? "Unpin Message" : "Pin Message"}>
                        <PinIcon size={14} />
                      </Tooltip>
                    </motion.button>
                  )}

                {(isOwnMessage || isCurrentUserAuthor) && !isEditing && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1, delay: 0.15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                    className="bg-[#121212] rounded-full p-1.5 sm:p-2 text-white hover:bg-[#1a1a1a] transition duration-100 active:scale-90 flex items-center justify-center"
                  >
                    <Tooltip title="Delete Message">
                      <DeleteIcon size={14} />
                    </Tooltip>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </div>
        <div className="flex md:hidden">
          <ChatTime datetime={created_at} />
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
