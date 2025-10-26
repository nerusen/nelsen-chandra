"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/common/components/elements/Container";
import Button from "@/common/components/elements/Button";
import { SmartTalkRoom } from "./SmartTalkRoom";

const SmartTalk = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("SmartTalkPage");
  const [chatHeight, setChatHeight] = useState('600px');

  useEffect(() => {
    const handleResize = () => {
      const newHeight = `${window.innerHeight - 300}px`;
      setChatHeight(newHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-medium">{t("title")}</h1>
          <p className="mb-6 border-b border-dashed border-neutral-600 pb-6 pt-2 text-neutral-600 dark:text-neutral-400 md:mb-0 md:border-b-0 md:pb-0">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="px-6 py-2 bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Login to Start Chatting
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
      style={{ height: chatHeight }}
    >
      <SmartTalkRoom />
    </div>
  );
};

export default SmartTalk;
