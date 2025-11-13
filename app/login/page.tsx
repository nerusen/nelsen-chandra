import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import LoginForm from "@/modules/login/components/LoginForm";
import { METADATA } from "@/common/constants/metadata";
import { authOptions } from "@/common/libs/next-auth";

export const metadata: Metadata = {
  title: `Login ${METADATA.exTitle}`,
  description: "Login to access all fitures",
  alternates: {
    canonical: `${process.env.DOMAIN}/login`,
  },
};

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/.");
  }

  return (
    <Container data-aos="fade-up">
      <PageHeading title="Login" description="Please sign in to access all features" />
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
