import { Metadata } from "next";
import { SiBuymeacoffee } from "react-icons/si";

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
        <div className="flex items-center gap-4">
          <MusicRoom />
          <a
            href="https://buymeacoffee.com/nerusen"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
          >
            <SiBuymeacoffee />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </PageHeading>
      <div className="mt-8">
        <MusicRoomContent />
      </div>
    </Container>
  );
};

export default MusicRoomPage;
