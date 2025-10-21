import Link from "next/link";
import { SiBuymeacoffee } from "react-icons/si";
import { useTranslations } from "next-intl";

const Introduction = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="space-y-2 bg-cover bg-no-repeat">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="text-3xl font-medium text-neutral-900 dark:text-neutral-50">
          <h1>{t("intro")}</h1>
        </div>
        <Link
          href="https://buymeacoffee.com/nerusen"
          target="_blank"
          passHref
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <SiBuymeacoffee />
          <span className="hidden sm:inline">Buy me a coffee</span>
        </Link>
      </div>

      <div className="space-y-4">
        <ul className="ml-5 flex list-disc flex-col gap-x-10 gap-y-2 text-neutral-700 dark:text-neutral-400 md:flex-row">
          <li>{t("location")}</li>
          <li>{t("location_type")}</li>
        </ul>
        <p className="mt-6 leading-loose text-neutral-600 dark:text-neutral-300">
          {t("resume")}
        </p>
      </div>
    </section>
  );
};

export default Introduction;
