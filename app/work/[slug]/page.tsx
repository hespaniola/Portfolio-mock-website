import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { ProjectPage } from "@/components/ProjectDetail";
import { Footer } from "@/components/sections/Footer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <>
      <main>
        <ProjectPage project={project} />
      </main>
      <Footer />
    </>
  );
}
