import Image from "next/image";
import Link from "next/link";
import Container from "../components/Container";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <section className="mx-auto max-w-4xl rounded-[44px] bg-white p-8 text-center shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D] md:p-12">
          <div className="relative mx-auto mb-8 h-40 w-40 md:h-52 md:w-52">
            <Image
              src="/logo-krida-bercerita.png"
              alt="Logo Krida Bercerita"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
            Halaman Tidak Ditemukan
          </p>

          <h1 className="text-6xl font-extrabold leading-tight text-[#0B2538] dark:text-white md:text-7xl">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-extrabold text-[#0B2538] dark:text-white md:text-4xl">
            Cerita ini belum ditemukan
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
            Maaf, halaman yang kamu cari tidak tersedia, sudah dipindahkan,
            atau belum dibuat. Kamu bisa kembali ke beranda atau memilih cerita
            lain di katalog.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25"
            >
              Kembali ke Beranda
            </Link>

            <Link
              href="/katalog"
              className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
            >
              Lihat Katalog Cerita
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}