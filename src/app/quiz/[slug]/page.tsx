import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "../../../components/Container";
import QuizClient from "../../../components/QuizClient";
import { supabase } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

type QuizPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  province: string;
  region: string;
};

type QuizQuestionRow = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id, slug, title, summary, province, region")
    .eq("slug", slug)
    .single<StoryRow>();

  if (storyError || !story) {
    notFound();
  }

  const { data: quizQuestions, error: quizError } = await supabase
    .from("quiz_questions")
    .select("id, question, options, answer")
    .eq("story_id", story.id)
    .order("created_at", { ascending: true });

  if (quizError) {
    throw new Error(quizError.message);
  }

  return (
    <main className="bg-[#FFF8E7] dark:bg-[#071722]">
      <section className="py-16">
        <Container>
          <Link
            href={`/cerita/${story.slug}`}
            className="mb-8 inline-flex font-extrabold text-[#EF4F3A]"
          >
            ← Kembali ke cerita
          </Link>

          <QuizClient story={story} quiz={(quizQuestions ?? []) as QuizQuestionRow[]} />
        </Container>
      </section>
    </main>
  );
}