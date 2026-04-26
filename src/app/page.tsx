import Image from "next/image";
import Link from "next/link";
import Container from "../components/Container";
import StoryCard from "../components/StoryCard";
import { supabase } from "../lib/supabaseClient";

export const dynamic = "force-dynamic";

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  province: string;
  region: string;
  summary: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
};

async function getFeaturedStories() {
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, slug, title, province, region, summary, image_url, is_featured, created_at"
    )
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return [];
  }

  return (data ?? []) as StoryRow[];
}

export default async function HomePage() {
  const featuredStories = await getFeaturedStories();

  return (
    <main>
      <section className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-5 inline-flex rounded-full bg-[#0E5A78]/10 px-4 py-2 text-sm font-extrabold text-[#0E5A78] dark:bg-white/10 dark:text-white">
                Belajar cerita rakyat Nusantara
              </p>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white md:text-6xl">
                Baca Cerita Rakyat Indonesia dengan Visual yang{" "}
                <span className="text-[#EF4F3A]">Menarik</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
                Krida Bercerita adalah website untuk membaca cerita rakyat
                Indonesia dengan tampilan ilustratif, edukatif, dan
                menyenangkan untuk anak-anak serta pelajar.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/katalog"
                  className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25"
                >
                  Mulai Membaca
                </Link>

                <Link
                  href="/fitur"
                  className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                >
                  Lihat Fitur
                </Link>
              </div>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
                <div>
                  <strong className="block text-2xl font-extrabold text-[#0B2538] dark:text-white">
                    38
                  </strong>
                  <span className="text-sm font-medium text-[#37576B] dark:text-white/70">
                    Provinsi
                  </span>
                </div>

                <div>
                  <strong className="block text-2xl font-extrabold text-[#0B2538] dark:text-white">
                    AI
                  </strong>
                  <span className="text-sm font-medium text-[#37576B] dark:text-white/70">
                    Visual
                  </span>
                </div>

                <div>
                  <strong className="block text-2xl font-extrabold text-[#0B2538] dark:text-white">
                    Quiz
                  </strong>
                  <span className="text-sm font-medium text-[#37576B] dark:text-white/70">
                    Edukasi
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[480px] items-center justify-center">
              <div className="absolute h-[420px] w-[420px] rounded-full bg-[#F6B23C]/20" />

              <Image
                src="/logo-krida-bercerita.png"
                alt="Ilustrasi Krida Bercerita"
                width={520}
                height={520}
                className="relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="fitur" className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
                Fitur Utama
              </p>
              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
                Fitur yang mendukung pengalaman membaca cerita rakyat
              </h2>
            </div>

            <p className="max-w-md text-[#37576B] dark:text-white/70">
              Ringkasan fitur utama Krida Bercerita. Detail tiap fitur dibuat di
              halaman terpisah agar tetap rapi dan mudah dibaca.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "🎨",
                "Visualisasi Cerita",
                "Ilustrasi cerita rakyat dibuat lebih menarik dan ramah untuk anak-anak.",
              ],
              [
                "🗺️",
                "Katalog Lintas Provinsi",
                "Cerita rakyat dapat dikelompokkan berdasarkan daerah dan provinsi.",
              ],
              [
                "📖",
                "Baca Tanpa Login",
                "Pengunjung tetap bisa membaca cerita rakyat tanpa harus membuat akun.",
              ],
              [
                "🧠",
                "Quiz Edukasi",
                "Pengguna dapat menjawab quiz setelah membaca cerita.",
              ],
              [
                "🔖",
                "Bookmark & Progress",
                "User login dapat menyimpan cerita favorit dan progress membaca.",
              ],
              [
                "🌙",
                "Mode Malam",
                "Tampilan khusus agar membaca lebih nyaman saat malam hari.",
              ],
            ].map(([icon, title, desc]) => (
              <article
                key={title}
                className="rounded-[28px] bg-white p-7 shadow-[0_10px_28px_rgba(11,37,56,0.09)] transition hover:-translate-y-1 dark:bg-[#102C3D]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EF4F3A]/10 text-2xl">
                  {icon}
                </div>
                <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
                Cerita Populer
              </p>
              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
                Mulai dari kisah yang paling dikenal
              </h2>
            </div>

            <p className="max-w-md text-[#37576B] dark:text-white/70">
              Pilih cerita rakyat berdasarkan judul, daerah asal, atau nilai 
              moral yang ingin dipelajari.
            </p>
          </div>

          {featuredStories.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
              <h3 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
                Belum ada cerita pilihan
              </h3>

              <p className="mt-3 text-[#37576B] dark:text-white/70">
                Admin dapat memilih cerita yang tampil di homepage dari
                dashboard admin.
              </p>

              <Link
                href="/katalog"
                className="mt-6 inline-flex rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white"
              >
                Lihat Katalog
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href="/katalog"
              className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] transition hover:-translate-y-1 dark:border-white/20 dark:text-white"
            >
              Lihat Semua Cerita
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
        <Container>
          <div className="rounded-[48px] bg-[#0B2538] px-8 py-16 text-white dark:bg-[#102C3D] md:px-12">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
                  Lintas Provinsi
                </p>
                <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight">
                  Jelajahi cerita rakyat dari seluruh Indonesia
                </h2>
              </div>

              <p className="max-w-md text-white/70">
                Kelompokkan cerita berdasarkan wilayah agar pengunjung
                lebih mudah menemukan kisah yang ingin dibaca.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[
                ["🌋", "Sumatera", "10 provinsi"],
                ["🏯", "Jawa", "6 provinsi"],
                ["🌿", "Kalimantan", "5 provinsi"],
                ["🌊", "Sulawesi", "6 provinsi"],
                ["🪶", "Papua & Maluku", "8 provinsi"],
                ["🌺", "Bali & Nusa Tenggara", "3 provinsi"],
              ].map(([icon, title, count]) => (
                <Link
                  key={title}
                  href="/katalog"
                  className="flex min-h-32 flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <span className="text-2xl">{icon}</span>
                  <span>
                    <strong className="block leading-tight">{title}</strong>
                    <span className="text-xs font-semibold text-white/65">
                      {count}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
        <Container>
          <div className="grid items-center gap-10 rounded-[44px] bg-white p-8 shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D] md:grid-cols-[0.9fr_1.1fr] md:p-11">
            <div className="relative min-h-80 overflow-hidden rounded-[34px]">
              <Image
                src="/Cerita2.png"
                alt="Tentang Krida Bercerita"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538]/60 via-[#0B2538]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
                Tentang Krida Bercerita
              </p>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
                Ruang digital untuk mengenal warisan cerita Indonesia
              </h2>

              <p className="mt-5 leading-7 text-[#37576B] dark:text-white/70">
                Website ini dibuat sebagai media pembelajaran dan hiburan
                ringan. Pengunjung dapat membaca cerita rakyat, mengenal daerah
                asalnya, dan memahami pesan moral dari setiap kisah.
              </p>

              <p className="mt-4 leading-7 text-[#37576B] dark:text-white/70">
                Desain visualnya memakai nuansa hangat, ilustratif, dan ramah
                untuk pelajar agar pengalaman membaca terasa dekat dengan dunia
                dongeng Nusantara.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}