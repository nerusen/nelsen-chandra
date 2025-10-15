"use client";

import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useState } from "react";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import GlassIcon from "@/common/components/elements/GlassIcon";
import { STACKS } from "@/common/constants/stacks";

const SkillList = () => {
  const t = useTranslations("HomePage");
  const [showAll, setShowAll] = useState(false);

  const stacksInArray: Array<
    [string, { icon: JSX.Element; background: string }]
  > = Object.entries(STACKS)
    .filter(([name, value]) => value.isActive)
    .map(([name, value]) => [
      name,
      { icon: value.icon, background: value.background },
    ]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("skills.title")} icon={<SkillsIcon />} />
        <SectionSubHeading>
          <p>{t("skills.sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className={`grid w-full gap-x-[1em] gap-y-[2.7em] py-2 ${showAll ? 'grid-cols-6 md:grid-cols-10 lg:grid-cols-11' : 'grid-cols-2 md:grid-cols-5'}`}>
        {stacksInArray.map(([name, { icon, background }], index) => {
          const isMain = ['HTML', 'CSS', 'TailwindCSS', 'JavaScript'].includes(name);
          const shouldShow = showAll || isMain;
          return (
            <div
              key={index}
              className={`transition-all duration-500 ease-in-out ${
                shouldShow
                  ? 'opacity-100 blur-0 scale-100'
                  : 'opacity-0 blur-sm scale-95 pointer-events-none'
              }`}
            >
              <GlassIcon
                name={name}
                icon={icon}
                background={background}
              />
            </div>
          );
        })}
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {showAll ? t("skills.show_less") : t("skills.show_more")}
        </button>
      </div>
    </section>
  );
};

export default SkillList;
