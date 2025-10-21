import Breakline from "@/common/components/elements/Breakline";

import Story from "./Story";
import CareerList from "./CareerList";
import EducationList from "./EducationList";
import YouTubeSection from "./YouTubeSection";

const About = () => {
  return (
    <>
      <Story />
      <Breakline className="my-8" />
      <CareerList />
      <Breakline className="my-8" />
      <EducationList />
      <Breakline className="my-8" />
      <YouTubeSection />
    </>
  );
};

export default About;
