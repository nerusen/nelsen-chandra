import { Metadata } from "next";
import { useTranslations } from "next-intl";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { METADATA } from "@/common/constants/metadata";
import MusicRoom from "@/modules/music-room";

export const metadata: Metadata = {
  title: `Music Room ${METADATA.exTitle}`,
  description: `Explore music and playlists in the Music Room`,
  alternates: {
    canonical: `${process.env.DOMAIN}/music-room`,
  },
};

const MusicRoomPage = () => {
  const t = useTranslations("MusicRoomPage");

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <MusicRoom />
    </Container>
  );
};

export default MusicRoomPage;
