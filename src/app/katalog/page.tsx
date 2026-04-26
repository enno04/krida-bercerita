"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import StoryCard from "../../components/StoryCard";
import { supabase } from "../../lib/supabaseClient";

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  province: string;
  region: string;
  summary: string;
  image_url: string;
  created_at: string;
};

const provinces = [
  "Semua Provinsi",
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Bengkulu",
  "Sumatera Selatan",
  "Kepulauan Bangka Belitung",
  "Lampung",
  "DKI Jakarta",
  "Banten",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Selatan",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Barat Daya",
];

export default function KatalogPage() {
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStories() {
      setIsLoading(true);
      setMessage("");

      const { data, error } = await supabase
        .from("stories")
        .select(
          "id, slug, title, province, region, summary, image_url, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      setStories(data ?? []);
      setIsLoading(false);
    }

    fetchStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const keyword = search.toLowerCase().trim();

      const matchSearch =
        story.title.toLowerCase().includes(keyword) ||
        story.province.toLowerCase().includes(keyword) ||
        story.region.toLowerCase().includes(keyword) ||
        story.summary.toLowerCase().includes(keyword);

      const matchProvince =
        selectedProvince === "Semua Provinsi" ||
        story.province === selectedProvince;

      return matchSearch && matchProvince;
    });
  }, [search, selectedProvince, stories]);

  function resetFilter() {
    setSearch("");
    setSelectedProvince("Semua Provinsi");
  }

  return (
    <main className="bg-[#FFF8E7] dark:bg-[#071722]">
      <section className="py-16 md:py-20">
        <Container>
          <div className="mb-10">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
              Katalog Cerita
            </p>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white md:text-5xl">
              Pilih cerita rakyat yang ingin kamu baca
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#37576B] dark:text-white/70 md:text-lg md:leading-8">
              Jelajahi kumpulan cerita rakyat dari berbagai daerah di Indonesia.
              Cari berdasarkan judul, daerah, atau pilih provinsi asal cerita.
            </p>
          </div>

          <div className="mb-10 rounded-[32px] bg-white p-4 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] md:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px_140px]">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-[#0B2538] dark:text-white">
                  Cari cerita
                </span>

                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg">
                    🔎
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari judul, daerah, provinsi, atau ringkasan..."
                    className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] pl-12 pr-5 font-medium text-[#0B2538] outline-none placeholder:text-[#37576B]/60 focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#071722] dark:text-white dark:placeholder:text-white/40"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-[#0B2538] dark:text-white">
                  Filter provinsi
                </span>

                <select
                  value={selectedProvince}
                  onChange={(event) => setSelectedProvince(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 font-bold text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#071722] dark:text-white"
                >
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilter}
                  className="h-14 w-full rounded-2xl border-2 border-[#0B2538]/15 px-5 font-extrabold text-[#0B2538] transition hover:border-[#EF4F3A] hover:text-[#EF4F3A] dark:border-white/15 dark:text-white"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-[#FFF8E7] p-4 text-sm font-semibold text-[#37576B] dark:bg-[#071722] dark:text-white/70 md:flex-row md:items-center md:justify-between">
              <p>
                Menampilkan{" "}
                <span className="font-extrabold text-[#EF4F3A]">
                  {filteredStories.length}
                </span>{" "}
                cerita
              </p>

              <p>
                Filter aktif:{" "}
                <span className="font-extrabold text-[#0B2538] dark:text-white">
                  {selectedProvince}
                </span>
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
              <p className="font-bold text-[#0B2538] dark:text-white">
                Memuat cerita dari database...
              </p>
            </div>
          )}

          {message && !isLoading && (
            <div className="rounded-[28px] bg-red-100 p-10 text-center text-red-700">
              <h2 className="text-2xl font-extrabold">Gagal memuat cerita</h2>
              <p className="mt-3">{message}</p>
            </div>
          )}

          {!isLoading && !message && filteredStories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          {!isLoading && !message && filteredStories.length === 0 && (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
              <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
                Cerita tidak ditemukan
              </h2>

              <p className="mt-3 text-[#37576B] dark:text-white/70">
                Coba gunakan kata kunci lain atau pilih provinsi berbeda.
              </p>

              <button
                type="button"
                onClick={resetFilter}
                className="mt-6 rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white"
              >
                Reset Filter
              </button>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}