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
    .filter(([name, value]) => value.isActive && (showAll || ['HTML', 'CSS', 'TailwindCSS'].includes(name)))
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

      <div className={`grid w-full gap-x-[1em] gap-y-[2.7em] py-2 ${showAll ? 'grid-cols-6 md:grid-cols-10 lg:grid-cols-11' : 'grid-cols-4 md:grid-cols-4 lg:grid-cols-4'}`}>
        {stacksInArray.map(([name, { icon, background }], index) => (
          <GlassIcon
            key={index}
            name={name}
            icon={icon}
            background={background}
          />
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700 text-sm px-3 py-2 rounded-md transition-all hover:bg-white/20 dark:hover:bg-gray-700/50 cursor-pointer text-gray-900 dark:text-gray-100"
        >
          {showAll ? t("skills.show_less") : t("skills.show_more")}
        </button>
      </div>
    </section>
  );
};

export default SkillList;
