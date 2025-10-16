"use client";

import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import GlassIcon from "@/common/components/elements/GlassIcon";
import { STACKS } from "@/common/constants/stacks";

const SkillList = () => {
  const t = useTranslations("HomePage");

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

      <div className="grid w-full gap-x-[1em] gap-y-[1.5em] py-2 grid-cols-4 md:grid-cols-10 lg:grid-cols-11 overflow-x-auto">
        {stacksInArray.map(([name, { icon, background }], index) => (
          <div
            key={name}
            className="transition-all duration-500 ease-in-out opacity-100 blur-0 scale-100"
          >
            <GlassIcon
              name={name}
              icon={icon}
              background={background}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillList;
