import { notFound } from "next/navigation";
import Container from "../../../../../components/Container";
import AdminEditStoryForm from "../../../../../components/AdminEditStoryForm";
import { supabase } from "../../../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

type EditStoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  province: string;
  region: string;
  summary: string;
  image_url: string;
  content: string[];
  moral: string;
};

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;

  const { data: story, error } = await supabase
    .from("stories")
    .select("id, slug, title, province, region, summary, image_url, content, moral")
    .eq("id", id)
    .single<StoryRow>();

  if (error || !story) {
    notFound();
  }

  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
          Admin
        </p>

        <h1 className="text-5xl font-extrabold text-[#0B2538] dark:text-white">
          Edit Cerita
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
          Perbarui cerita rakyat yang sudah ada di database.
        </p>

        <AdminEditStoryForm story={story} />
      </Container>
    </main>
  );
}