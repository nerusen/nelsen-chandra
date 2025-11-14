import { Metadata } from "next";

import Container from "@/common/components/elements/Container";
import { METADATA } from "@/common/constants/metadata";
import StrikeGame from "@/modules/strike-game";

export const metadata: Metadata = {
  title: `Strike Game ${METADATA.exTitle}`,
  description: "Build your daily strike streak and climb the ranks!",
  alternates: {
    canonical: `${process.env.DOMAIN}/strike-game`,
  },
};

const StrikeGamePage = () => {
  return (
    <Container data-aos="fade-up">
      <StrikeGame />
    </Container>
  );
};

export default StrikeGamePage;
