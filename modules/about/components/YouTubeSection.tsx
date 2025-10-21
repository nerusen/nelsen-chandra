"use client";

import Link from "next/link";
import { TbBrandYoutube as YouTubeIcon } from "react-icons/tb";
import { LuExternalLink as ExternalLinkIcon } from "react-icons/lu";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";

const YouTubeSection = () => {
  const t = useTranslations("AboutPage.youtube");

  // YouTube video ID
  const videoId = "E8lXC2mR6";
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;



  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<YouTubeIcon />} />
        <SectionSubHeading>
          <>
            <p>{t("sub_title")}</p>
            <div className="mt-2 flex flex-col gap-4 md:mt-0 md:flex-row">
              <Link
                href={youtubeUrl}
                target="_blank"
                passHref
                className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
                data-umami-event="click_youtube_show_more_button"
              >
                <ExternalLinkIcon />
                <span>{t("show_more")}</span>
              </Link>
            </div>
          </>
        </SectionSubHeading>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        ></iframe>


      </div>
    </section>
  );
};

export default YouTubeSection;
