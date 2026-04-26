import Container from "../../components/Container";
import Link from "next/link";

const features = [
  {
    title: "Katalog Cerita Rakyat",
    description:
      "Pengunjung dapat menjelajahi cerita rakyat dari berbagai wilayah Indonesia berdasarkan judul, provinsi, dan daerah asal.",
  },
  {
    title: "Visual Cerita",
    description:
      "Setiap cerita dilengkapi gambar ilustratif agar pengalaman membaca terasa lebih menarik untuk anak-anak dan pelajar.",
  },
  {
    title: "Quiz Edukasi",
    description:
      "Setelah membaca cerita, pengguna dapat mengerjakan quiz untuk menguji pemahaman isi cerita dan pesan moralnya.",
  },
  {
    title: "Mode Malam",
    description:
      "Tampilan gelap membantu pengguna membaca dengan lebih nyaman, terutama saat malam hari atau di tempat minim cahaya.",
  },
  {
    title: "Bookmark Cerita",
    description:
      "User yang login dapat menyimpan cerita favorit agar mudah dibaca kembali dari dashboard.",
  },
  {
    title: "Progress Membaca",
    description:
      "User dapat menyimpan progress membaca dan melanjutkan cerita dari dashboard kapan saja.",
  },
  {
    title: "Nilai Terbaik Quiz",
    description:
      "Hasil quiz user akan disimpan sebagai nilai terbaik sehingga pengguna bisa memantau perkembangan belajarnya.",
  },
  {
    title: "Cerita Rakyat Terbaru",
    description:
      "Kami selalu menambahkan cerita baru secara berkala agar pengguna selalu memiliki kisah menarik untuk dibaca dan dipelajari.",
  },
];

export default function FiturPage() {
  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
          Fitur Website
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
              Fitur utama Krida Bercerita
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
              Krida Bercerita dirancang sebagai website membaca cerita rakyat
              Indonesia yang edukatif, menarik, dan mudah digunakan oleh
              semua kalangan, terutama pelajar.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Akses pengguna
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Pengguna biasa tetap bisa membaca cerita dan mengerjakan quiz. Pengguna yang sudah
              login mendapat fitur tambahan seperti bookmark, progress membaca,
              dan nilai terbaik quiz.
            </p>
          </div>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EF4F3A] text-lg font-extrabold text-white">
                {index + 1}
              </div>

              <h2 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-12 rounded-[36px] bg-[#0B2538] p-8 text-white dark:bg-[#102C3D]">
          <h2 className="text-3xl font-extrabold">
            Siap mulai membaca cerita?
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-white/70">
            Jelajahi cerita rakyat dari berbagai daerah dan uji pemahamanmu
            melalui quiz edukasi.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/katalog"
              className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white"
            >
              Mulai Membaca
            </Link>

            <Link
              href="/tentang"
              className="rounded-full border-2 border-white/20 px-7 py-4 font-bold text-white"
            >
              Tentang Website
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}