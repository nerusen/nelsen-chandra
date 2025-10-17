import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { MdAdminPanelSettings as AdminIcon } from "react-icons/md";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { FiTrash2 as DeleteIcon } from "react-icons/fi";
import { BsFillReplyAllFill as ReplyIcon } from "react-icons/bs";
import { BsPinAngleFill as PinIcon } from "react-icons/bs";
import { MdEdit as EditIcon } from "react-icons/md";

import ChatTime from "./ChatTime";

import Tooltip from "@/common/components/elements/Tooltip";
import { MessageProps } from "@/common/types/chat";

interface ChatItemProps extends MessageProps {
  isWidget?: boolean;
  onDelete: (id: string) => void;
  onReply: (name: string) => void;
  onPin: (id: string, is_pinned: boolean) => void;
  onEdit: (id: string, message: string) => void;
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
}: ChatItemProps) => {
  const [isHover, setIsHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(message);
  const { data: session } = useSession();

  const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL;
  const isAuthor = email === authorEmail;
  const isOwnMessage = session?.user?.email === email;

  const condition = isAuthor && !isWidget;

  const handleEditSave = () => {
    if (editMessage.trim()) {
      onEdit(id, editMessage);
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditMessage(message);
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 lg:px-8",
        condition && "flex-row-reverse",
        isEditing && "blur-sm",
      )}
    >
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
            "flex items-center gap-x-2",
            condition && "flex-row-reverse",
          )}
        >
          <div className="text-sm dark:text-neutral-200">{name}</div>
          {condition && (
            <>
              <div className="flex items-center gap-[2px] rounded-full bg-teal-500/20 px-1.5 py-0.5 font-medium text-teal-300 ">
                <AdminIcon size={13} />
                <span className="text-[10px]">Author</span>
              </div>
              <div className="flex items-center gap-[2px] rounded-full bg-blue-500/20 px-1.5 py-0.5 font-medium text-blue-400 ">
                <VerifiedIcon size={13} />
                <span className="text-[10px]">Verified</span>
              </div>
            </>
          )}
          <div className="hidden md:flex">
            <ChatTime datetime={created_at} />
          </div>
        </div>
        <div
          className={clsx(
            "group ml-1.5 mr-2 flex w-fit items-center gap-3",
            condition && "flex-row-reverse",
          )}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className={clsx(
            "rounded-xl px-4 py-2 relative",
            condition
              ? "author-gradient-border"
              : "bg-neutral-200 group-hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:group-hover:bg-neutral-600",
            isEditing && "blur-none",
          )}>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave();
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {is_reply && (
                  <>
                    <span className="text-blue-500">@{reply_to} </span>
                    <span>{message}</span>
                    {is_pinned && <><br /><span className="text-xs text-neutral-700 font-medium">Pinned</span></>}
                  </>
                )}
                {!is_reply && <>{message}{is_pinned && <><br /><span className="text-xs text-neutral-700 font-medium">Pinned</span></>}</>}
              </>
            )}
          </div>

          {isHover && !isEditing && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0, transform: "rotate(45deg)" }}
                animate={{ opacity: 1, scale: 1, transform: "rotate(0deg)" }}
                transition={{ duration: 0.2 }}
                onClick={() => onReply(name)}
              >
                <Tooltip title="Reply">
                  <ReplyIcon
                    size={15}
                    className={clsx(
                      "transition duration-300 active:scale-90",
                      condition && "scale-x-[-1] active:scale-x-[-1]",
                    )}
                  />
                </Tooltip>
              </motion.button>

              {isOwnMessage && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => setIsEditing(true)}
                  className="rounded-md bg-blue-600 p-2 text-white transition duration-100 hover:bg-blue-500 w-9 h-9 flex items-center justify-center"
                >
                  <Tooltip title="Edit Message">
                    <EditIcon size={16} />
                  </Tooltip>
                </motion.button>
              )}

              {session?.user?.email === authorEmail && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => onPin(id, !is_pinned)}
                  className="rounded-md bg-yellow-500 p-2 text-yellow-50 transition duration-100 hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500 w-9 h-9 flex items-center justify-center"
                >
                  <Tooltip title={is_pinned ? "Unpin Message" : "Pin Message"}>
                    <PinIcon size={16} />
                  </Tooltip>
                </motion.button>
              )}
            </>
          )}

          {isOwnMessage && isHover && !isEditing ? (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              onClick={() => onDelete(id)}
              className="rounded-md bg-red-600 p-2 text-red-50 transition duration-100 hover:bg-red-500 w-9 h-9 flex items-center justify-center"
            >
              <DeleteIcon size={16} />
            </motion.button>
          ) : null}
        </div>
        <div className="flex md:hidden">
          <ChatTime datetime={created_at} />
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
