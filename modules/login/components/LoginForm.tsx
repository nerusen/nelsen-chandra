"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

import Button from "@/common/components/elements/Button";

const LoginForm = () => {
  const t = useTranslations("LoginPage");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/home" });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          {t("title")}
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <Button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </Button>

        <Button
          onClick={handleGithubSignIn}
          className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 dark:border-neutral-600 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-800 transition-colors"
        >
          <BsGithub size={20} className="text-white" />
          <span className="text-white dark:text-neutral-200">Continue with GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
