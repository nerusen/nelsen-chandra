import { Metadata } from "next";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
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
      <PageHeading title="Strike Game" description="Build your daily strike streak and climb the ranks!">
        <StrikeGame />
      </PageHeading>
    </Container>
  );
};

export default StrikeGamePage;
