"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "../../elements/Image";
import Button from "../../elements/Button";

const SmartTalkUserInfo = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="mt-4 px-4">
        <Link href="/login">
          <Button className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200">
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 px-4">
      <div className="flex items-center gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
        <Image
          src={session.user?.image || "/images/default-avatar.png"}
          width={40}
          height={40}
          alt={session.user?.name || "User"}
          rounded="rounded-full"
          className="border-2 border-white dark:border-neutral-700"
        />
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {session.user?.name}
          </div>
          <div className="truncate text-xs text-neutral-600 dark:text-neutral-400">
            {session.user?.email}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SmartTalkUserInfo;
