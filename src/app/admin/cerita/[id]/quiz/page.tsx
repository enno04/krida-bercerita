import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../../../../components/Container";
import AdminQuizManager from "../../../../../components/AdminQuizManager";
import { supabase } from "../../../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

type QuizAdminPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StoryInfo = {
  id: string;
  slug: string;
  title: string;
};

export default async function AdminQuizPage({ params }: QuizAdminPageProps) {
  const { id } = await params;

  const { data: story, error } = await supabase
    .from("stories")
    .select("id, slug, title")
    .eq("id", id)
    .single<StoryInfo>();

  if (error || !story) {
    notFound();
  }

  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <Link
          href="/admin"
          className="mb-8 inline-flex font-extrabold text-[#EF4F3A]"
        >
          ← Kembali ke admin
        </Link>

        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
          Admin Quiz
        </p>

        <h1 className="text-5xl font-extrabold text-[#0B2538] dark:text-white">
          Kelola Quiz
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
          Tambahkan pertanyaan quiz untuk cerita{" "}
          <strong>{story.title}</strong>.
        </p>

        <AdminQuizManager story={story} />
      </Container>
    </main>
  );
}