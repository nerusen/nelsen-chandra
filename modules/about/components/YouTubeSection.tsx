"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { TbBrandYoutube as YouTubeIcon } from "react-icons/tb";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { LuExternalLink as ExternalLinkIcon } from "react-icons/lu";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import Button from "@/common/components/elements/Button";

const YouTubeSection = () => {
  const t = useTranslations("AboutPage.youtube");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube video ID
  const videoId = "EwzWg-Joxq0";
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handlePlay = () => {
    if (iframeRef.current) {
      // Send play command to iframe
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
      setIsPlaying(true);
      setShowOverlay(false);
    }
  };

  const handlePause = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
      setIsPlaying(false);
    }
  };

  const handleSeek = (seconds: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"seekTo","args":[${seconds},true]}`,
        "*"
      );
    }
  };

  const handleSpeed = (rate: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setPlaybackRate","args":[${rate}]}`,
        "*"
      );
    }
  };

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
            onClick={handlePlay}
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

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-75 p-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="rounded p-2 hover:bg-white hover:bg-opacity-20"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={() => handleSeek(-10)}
              className="rounded p-2 hover:bg-white hover:bg-opacity-20"
            >
              <FaBackward />
            </button>
            <button
              onClick={() => handleSeek(10)}
              className="rounded p-2 hover:bg-white hover:bg-opacity-20"
            >
              <FaForward />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeed(0.5)}
              className="rounded px-2 py-1 text-sm hover:bg-white hover:bg-opacity-20"
            >
              0.5x
            </button>
            <button
              onClick={() => handleSpeed(1)}
              className="rounded px-2 py-1 text-sm hover:bg-white hover:bg-opacity-20"
            >
              1x
            </button>
            <button
              onClick={() => handleSpeed(1.5)}
              className="rounded px-2 py-1 text-sm hover:bg-white hover:bg-opacity-20"
            >
              1.5x
            </button>
            <button
              onClick={() => handleSpeed(2)}
              className="rounded px-2 py-1 text-sm hover:bg-white hover:bg-opacity-20"
            >
              2x
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
