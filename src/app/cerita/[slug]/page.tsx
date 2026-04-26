import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "../../../components/Container";
import { supabase } from "../../../lib/supabaseClient";
import ReaderActions from "../../../components/ReaderActions";

export const dynamic = "force-dynamic";

type StoryDetailPageProps = {
  params: Promise<{
    slug: string;
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
  created_at: string;
};

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { slug } = await params;

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      "id, slug, title, province, region, summary, image_url, content, moral, created_at"
    )
    .eq("slug", slug)
    .single<StoryRow>();

  if (error || !story) {
    notFound();
  }

  const imageSrc = story.image_url || "/cerita.png";

  return (
    <main className="bg-[#FFF8E7] dark:bg-[#071722]">
      <section className="py-16">
        <Container>
          <Link
            href="/katalog"
            className="mb-8 inline-flex font-extrabold text-[#EF4F3A]"
          >
            ← Kembali ke katalog
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <article className="overflow-hidden rounded-[44px] bg-white shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D]">
              <div className="relative min-h-[260px] overflow-hidden md:min-h-[380px]">
                <Image
                  src={imageSrc}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538]/75 via-[#0B2538]/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                  <p className="mb-3 inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-extrabold text-[#0E5A78]">
                    {story.province}
                  </p>

                  <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                    {story.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 md:p-12">
                <div className="mb-8 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#F6B23C]/20 px-4 py-2 text-sm font-extrabold text-[#8A5A00]">
                    Wilayah {story.region}
                  </span>

                  <span className="rounded-full bg-[#0E5A78]/10 px-4 py-2 text-sm font-extrabold text-[#0E5A78] dark:bg-white/10 dark:text-white">
                    AI Visual
                  </span>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-extrabold text-green-700">
                    Bisa dibaca gratis
                  </span>
                </div>

                <div className="space-y-5 text-base leading-8 text-[#37576B] dark:text-white/70 md:text-lg md:leading-9">
                {story.content.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">
                    {paragraph}
                    </p>
                ))}
                </div>

                <div className="mt-10 rounded-[28px] bg-[#FFF8E7] p-6 dark:bg-[#071722]">
                  <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
                    Pesan Moral
                  </p>

                    <p className="whitespace-pre-line text-lg font-semibold leading-8 text-[#0B2538] dark:text-white">
                    {story.moral}
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/quiz/${story.slug}`}
                    className="rounded-full bg-[#EF4F3A] px-7 py-4 text-center font-bold text-white shadow-lg shadow-[#EF4F3A]/25"
                  >
                    Mulai Quiz
                  </Link>

                  <Link
                    href="/katalog"
                    className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 text-center font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                  >
                    Baca Cerita Lain
                  </Link>
                </div>

                <p className="mt-4 text-sm text-[#37576B] dark:text-white/60">
                  Catatan: untuk cerita baru dari admin, quiz akan kita
                  hubungkan ke database di tahap berikutnya.
                </p>
              </div>
            </article>

            <aside className="h-fit rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] lg:sticky lg:top-28">
            <h2 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
                Fitur Pembaca
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
                Kamu tetap bisa membaca tanpa login. Login dibutuhkan untuk menyimpan
                progres membaca, bookmark, dan riwayat quiz.
            </p>

            <ReaderActions storyId={story.id} />
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}