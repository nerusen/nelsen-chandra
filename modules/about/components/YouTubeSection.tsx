"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { TbBrandYoutube as YouTubeIcon } from "react-icons/tb";

import { LuExternalLink as ExternalLinkIcon } from "react-icons/lu";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import Button from "@/common/components/elements/Button";

const YouTubeSection = () => {
  const t = useTranslations("AboutPage.youtube");
  const [showOverlay, setShowOverlay] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube video ID
  const videoId = "EwzWg-Joxq0";
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
        {showOverlay && (
          <div
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowOverlay(false)}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
              <svg
                className="ml-1 h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0`}
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
