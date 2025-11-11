import Image from "next/image";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface LinkPreviewProps {
  url: string;
  className?: string;
}

interface LinkData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const LinkPreview = ({ url, className }: LinkPreviewProps) => {
  const [data, setData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(false);

        // Use a simple proxy or direct fetch for metadata
        // Since we can't install packages, we'll use a basic implementation
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const previewData = await response.json();
          setData(previewData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className={clsx("mb-2 p-3 border rounded-lg bg-emerald-200 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null; // Don't show preview if failed to load
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("mb-2 block p-3 border rounded-lg bg-emerald-200 dark:bg-[#041a12] border-neutral-200 dark:border-neutral-700 hover:bg-emerald-300 dark:hover:bg-[#052e16] transition-colors", className)}
    >
      <div className="flex flex-col gap-3">
        {data.image && (
          <div className="w-full">
            <Image
              src={data.image}
              alt={data.title || "Link preview"}
              width={200}
              height={120}
              className="rounded-lg object-cover w-full h-auto max-h-32"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {data.title && (
            <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
              {data.title}
            </h4>
          )}
          {data.description && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
              {data.description}
            </p>
          )}
          {data.siteName && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {data.siteName}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
