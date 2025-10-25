import { useTranslations } from "next-intl";
import Link from "next/link";

import Button from "@/common/components/elements/Button";

const SmartTalkAuth = () => {
  const t = useTranslations("ChatRoomPage");

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border-t border-neutral-200 dark:border-neutral-700">
      <div className="text-center">
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
          {t("sign_in.title")}
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {t("sign_in.label")}
        </p>
      </div>
      <Link href="/login">
        <Button className="px-4 py-2 bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          Login to Chat
        </Button>
      </Link>
    </div>
  );
};

export default SmartTalkAuth;
