import React from "react";

interface PageHeadingProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeading = ({ title, description, children }: PageHeadingProps) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-medium">{title}</h1>
            <p className="pt-2 text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          </div>
          {children && (
            <div className="flex items-center gap-4">
              {children}
            </div>
          )}
        </div>
        <div className="border-b border-dashed border-neutral-600"></div>
      </div>
    </>
  );
};

export default PageHeading;
