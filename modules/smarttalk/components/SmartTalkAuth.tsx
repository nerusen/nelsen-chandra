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
        <Button className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200">
          Login to start chatting
        </Button>
      </Link>
    </div>
  );
};

export default SmartTalkAuth;
