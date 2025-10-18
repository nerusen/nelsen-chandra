import React from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  SiAdobephotoshop,
  SiWakatime,
  SiWebflow,
  SiWordpress,
  SiReact,
  SiReplit,
  SiYoutube,
  SiAdobelightroom,
  SiDribbble,
  SiAdobeillustrator,
  SiPinterest,
  SiCoursera,
  SiHostinger,
  SiBehance,
  SiCanva,
  SiCss3,
  SiFirebase,
  SiGithub,
  SiGooglecloud,
  SiGooglefonts,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiGooglegemini,
  SiCoreldraw,
  SiClaude,
  SiGoogledataproc,
  SiMonkeytype,
  SiOpenai,
  SiPhp,
  SiPhpmyadmin,
  SiPinterest,
} from "react-icons/si";

export type SkillProps = {
  [key: string]: {
    icon: JSX.Element;
    background: string;
    color: string;
    isActive?: boolean;
  };
};

const iconSize = 26;

export const STACKS: SkillProps = {
  HTML: {
    icon: <SiHtml5 size={iconSize} />,
    background: "bg-orange-500",
    color: "text-orange-500",
    isActive: true,
  },
  CSS: {
    icon: <SiCss3 size={iconSize} />,
    background: "bg-blue-500",
    color: "text-blue-500",
    isActive: true,
  },
  TailwindCSS: {
    icon: <SiTailwindcss size={iconSize} />,
    background: "bg-sky-400",
    color: "text-sky-400",
    isActive: true,
  },
  AdobePhotoshop: {
    icon: <SiAdobephotoshop size={iconSize} />,
    background: "bg-blue-600",
    color: "text-blue-600",
    isActive: true,
  },
  Canva: {
    icon: <SiCanva size={iconSize} />,
    background: "bg-blue-500",
    color: "text-blue-500",
    isActive: true,
  },

  Vercel: {
    icon: <SiVercel size={iconSize} />,
    background: "bg-neutral-800",
    color: "text-white",
    isActive: true,
  },
  Github: {
    icon: <SiGithub size={iconSize} />,
    background: "bg-gray-800",
    color: "text-white",
    isActive: true,
  },
  Firebase: {
    icon: <SiFirebase size={iconSize} />,
    background: "bg-yellow-500",
    color: "text-yellow-500",
    isActive: true,
  },
  Supabase: {
    icon: <SiSupabase size={iconSize} />,
    background: "bg-green-500",
    color: "text-green-500",
    isActive: true,
  },
  Behance: {
    icon: <SiBehance size={iconSize} />,
    background: "bg-blue-600",
    color: "text-blue-600",
    isActive: true,
  },
  GoogleCloud: {
    icon: <SiGooglecloud size={iconSize} />,
    background: "bg-blue-500",
    color: "text-blue-500",
    isActive: true,
  },
  GoogleFonts: {
    icon: <SiGooglefonts size={iconSize} />,
    background: "bg-red-500",
    color: "text-red-500",
    isActive: true,
  },

  GooglePlus: {
    icon: <FaGooglePlusG size={iconSize} />,
    background: "bg-red-500",
    color: "text-red-500",
    isActive: true,
  },
  Google: {
    icon: <FcGoogle size={iconSize} />,
    background: "bg-neutral-900",
    color: "text-gray-800",
    isActive: true,
  },
  JavaScript: {
    icon: <SiJavascript size={iconSize} />,
    background: "bg-yellow-500",
    color: "text-yellow-500",
    isActive: true,
  },
  TypeScript: {
    icon: <SiTypescript size={iconSize} />,
    background: "bg-blue-600",
    color: "text-blue-600",
    isActive: true,
  },
  'Next.js': {
    icon: <SiNextdotjs size={iconSize} />,
    background: "bg-neutral-800",
    color: "text-white",
    isActive: true,
  },
};
