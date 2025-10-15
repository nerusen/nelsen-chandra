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

      <div className={`grid w-full gap-x-[1em] gap-y-[2.7em] py-2 ${showAll ? 'grid-cols-6 md:grid-cols-10 lg:grid-cols-11' : 'grid-cols-4'}`}>
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
          className="group relative h-[2.6em] w-auto bg-transparent outline-none [-webkit-tap-highlight-color:transparent] [perspective:24em] [transform-style:preserve-3d] px-3 py-2 text-sm leading-[1.2] whitespace-nowrap rounded-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] md:h-[3em]"
          style={{
            boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
          }}
        >
          <span
            className="absolute left-0 top-0 block h-full w-full origin-[100%_100%] rotate-[15deg] rounded-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)] bg-gray-500/20 dark:bg-gray-400/20"
          ></span>
          <span className="absolute left-0 top-0 flex h-full w-full origin-[80%_50%] transform rounded-md bg-[hsla(0,0%,100%,0.15)] dark:bg-[hsla(0,0%,0%,0.15)] backdrop-blur-[0.75em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [-webkit-backdrop-filter:blur(0.75em)] group-hover:[transform:translateZ(2em)] border border-white/20 dark:border-gray-700">
            <span className="m-auto flex h-full items-center justify-center text-gray-900 dark:text-gray-100">
              {showAll ? t("skills.show_less") : t("skills.show_more")}
            </span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default SkillList;
