"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import Container from "@/common/components/elements/Container";
import Button from "@/common/components/elements/Button";
import { SmartTalkRoom } from "./SmartTalkRoom";

const SmartTalk = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("SmartTalkPage");

  if (status === "loading") {
    return (
      <Container
        data-aos="fade-up"
        className="flex h-full flex-col items-center justify-center gap-y-4 transition-all duration-300"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700 dark:border-neutral-300 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container
        data-aos="fade-up"
        className="flex h-full flex-col items-center justify-center gap-y-4 transition-all duration-300"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-neutral-700 dark:text-neutral-300">
            {t("title")}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            {t("description")}
          </p>
          <Link href="/login">
            <Button className="px-6 py-2 bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Login to Start Chatting
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return <SmartTalkRoom />;
};

export default SmartTalk;
