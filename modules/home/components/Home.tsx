import Breakline from "@/common/components/elements/Breakline";

import Introduction from "./Introduction";
import SkillList from "./SkillList";
import YouTubeSection from "@/modules/about/components/YouTubeSection";
import BentoGrid from "./Bento/BentoGrid";

const Home = () => {
  return (
    <>
      <Introduction />
      <Breakline className="my-8" />
      <SkillList />
      <Breakline className="my-8" />
      <YouTubeSection />
      <Breakline className="my-8" />
      <BentoGrid />
    </>
  );
};

export default Home;
