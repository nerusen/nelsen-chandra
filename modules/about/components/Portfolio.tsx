import Link from "next/link";
import { useTranslations } from "next-intl";
import { LuDownload as DownloadIcon } from "react-icons/lu";

const Portfolio = () => {
  const t = useTranslations("AboutPage");

  const PORTFOLIO_URL =
    "https://linktr.ee/nerusendsgn";

  return (
    <Link
      href={PORTFOLIO_URL}
      target="_blank"
      passHref
      className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100  px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
      data-umami-event="click_portfolio_download_button"
    >
      <DownloadIcon />
      <span>{t("portfolio_download_button")}</span>
    </Link>
  );
};

export default Portfolio;
