import { Metadata } from "next";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";
import { getProjectsDataBySlug } from "@/services/projects";

interface ProjectDetailPageProps {
  params: { slug: string };
}

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const project = await getProjectDetail(params?.slug);

  if (!project) {
    return {
      title: `Project Not Found ${METADATA.exTitle}`,
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.title} ${METADATA.exTitle}`,
    description: project.description,
    openGraph: {
      images: project.image,
      url: `${METADATA.openGraph.url}/${project.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: METADATA.openGraph.locale,
      type: "article",
      authors: METADATA.creator,
    },
    keywords: project.title,
    alternates: {
      canonical: `${process.env.DOMAIN}/projects/${params.slug}`,
    },
  };
};

const getProjectDetail = async (slug: string): Promise<ProjectItem | null> => {
  try {
    const projects = await getProjectsDataBySlug(slug);
    if (!projects) {
      console.error(`Project with slug "${slug}" not found in database.`);
      return null;
    }
    const contents = loadMdxFiles();
    const content = contents.find((item) => item.slug === slug);
    if (!content) {
      console.error(`MDX content for slug "${slug}" not found.`);
    }
    const response = { ...projects, content: content?.content };
    const data = JSON.parse(JSON.stringify(response));
    return data;
  } catch (error) {
    console.error(`Error fetching project detail for slug "${slug}":`, error);
    return null;
  }
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const data = await getProjectDetail(params?.slug);

  if (!data) {
    return (
      <Container data-aos="fade-up">
        <BackButton url="/projects" />
        <PageHeading title="Project Not Found" description="The requested project could not be found." />
        <div className="text-center">
          <p>The project you are looking for does not exist or has been removed.</p>
        </div>
      </Container>
    );
  }

  const PAGE_TITLE = data.title;
  const PAGE_DESCRIPTION = data.description;

  return (
    <Container data-aos="fade-up">
      <BackButton url="/projects" />
      <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <ProjectDetail {...data} />
    </Container>
  );
};

export default ProjectDetailPage;
