import { Metadata } from "next";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { METADATA } from "@/common/constants/metadata";
import MusicRoom from "@/modules/music-room";
import MusicRoomContent from "./content";

export const metadata: Metadata = {
  title: `Music Room ${METADATA.exTitle}`,
  description: `Explore music and playlists in the Music Room`,
  alternates: {
    canonical: `${process.env.DOMAIN}/music-room`,
  },
};

const MusicRoomPage = () => {
  return (
    <Container data-aos="fade-up">
      <PageHeading title="Music Room" description="Explore music and playlists in the Music Room">
        <MusicRoom />
      </PageHeading>
      <MusicRoomContent />
    </Container>
  );
};

export default MusicRoomPage;
