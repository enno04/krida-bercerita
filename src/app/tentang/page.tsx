import Image from "next/image";
import Link from "next/link";
import Container from "../../components/Container";

export default function TentangPage() {
  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
              Tentang Krida Bercerita
            </p>

            <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
              Ruang digital untuk mengenal warisan cerita Indonesia
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#37576B] dark:text-white/70">
              Krida Bercerita adalah website pembelajaran dan hiburan ringan
              yang menghadirkan cerita rakyat dari berbagai daerah di Indonesia.
              Website ini dibuat agar pengguna dapat membaca, mengenal budaya
              Nusantara, dan memahami pesan moral dari setiap cerita.
            </p>

            <p className="mt-4 text-lg leading-8 text-[#37576B] dark:text-white/70">
              Pengunjung dapat membaca cerita tanpa harus login. Namun, user
              yang membuat akun dapat menikmati fitur tambahan seperti bookmark,
              progress membaca, dan penyimpanan nilai terbaik quiz.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/katalog"
                className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white"
              >
                Jelajahi Cerita
              </Link>

              <Link
                href="/fitur"
                className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
              >
                Lihat Fitur
              </Link>
            </div>
          </div>

          <div className="rounded-[44px] bg-white p-8 shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D]">
            <div className="relative mx-auto aspect-square max-w-[420px]">
              <Image
                src="/logo-krida-bercerita.png"
                alt="Logo Krida Bercerita"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <article className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Tujuan
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Membantu pelajar dan pembaca umum mengenal cerita rakyat Indonesia
              melalui media digital yang mudah diakses.
            </p>
          </article>

          <article className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Manfaat
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Pengguna dapat meningkatkan minat baca, memahami pesan moral,
              dan mengenal budaya dari berbagai daerah.
            </p>
          </article>

          <article className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Pengguna
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Website ini dapat digunakan oleh anak-anak, pelajar, guru,
              pembaca umum, dan semua segala usia.
            </p>
          </article>
        </section>

        <section className="mt-16 rounded-[36px] bg-[#0B2538] p-8 text-white dark:bg-[#102C3D]">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
            Kesimpulan
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            Cerita rakyat bisa dibaca dengan cara yang lebih menarik
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-white/70">
            Dengan katalog cerita, visual pendukung, quiz edukasi, mode malam,
            bookmark, dan progress membaca, Krida Bercerita menjadi media
            sederhana untuk belajar sekaligus menikmati kisah Nusantara.
          </p>
        </section>
      </Container>
    </main>
  );
}