"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

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

type QuizQuestionRow = {
  id: string;
  story_id: string;
};

type StoryWithQuizCount = StoryRow & {
  quiz_count: number;
};

export default function AdminStoriesList() {
  const [stories, setStories] = useState<StoryWithQuizCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState("semua");
  const [featuredFilter, setFeaturedFilter] = useState("semua");

  async function fetchStories() {
    setIsLoading(true);
    setMessage("");

    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .select(
        "id, slug, title, province, region, summary, image_url, is_featured, created_at"
      )
      .order("created_at", { ascending: false });

    if (storyError) {
      setMessage(storyError.message);
      setIsLoading(false);
      return;
    }

    const { data: quizData, error: quizError } = await supabase
      .from("quiz_questions")
      .select("id, story_id");

    if (quizError) {
      setMessage(quizError.message);
      setIsLoading(false);
      return;
    }

    const quizCountMap = new Map<string, number>();

    (quizData ?? []).forEach((quiz: QuizQuestionRow) => {
      const currentCount = quizCountMap.get(quiz.story_id) ?? 0;
      quizCountMap.set(quiz.story_id, currentCount + 1);
    });

    const storiesWithQuizCount = (storyData ?? []).map((story) => ({
      ...story,
      quiz_count: quizCountMap.get(story.id) ?? 0,
    }));

    setStories(storiesWithQuizCount);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const keyword = search.toLowerCase().trim();

      const matchSearch =
        story.title.toLowerCase().includes(keyword) ||
        story.province.toLowerCase().includes(keyword) ||
        story.region.toLowerCase().includes(keyword) ||
        story.slug.toLowerCase().includes(keyword) ||
        story.summary.toLowerCase().includes(keyword);

      const matchQuiz =
        quizFilter === "semua" ||
        (quizFilter === "sudah" && story.quiz_count > 0) ||
        (quizFilter === "belum" && story.quiz_count === 0);

      const matchFeatured =
        featuredFilter === "semua" ||
        (featuredFilter === "tampil" && story.is_featured) ||
        (featuredFilter === "belum" && !story.is_featured);

      return matchSearch && matchQuiz && matchFeatured;
    });
  }, [stories, search, quizFilter, featuredFilter]);

  function resetFilter() {
    setSearch("");
    setQuizFilter("semua");
    setFeaturedFilter("semua");
  }

  async function handleToggleFeatured(story: StoryWithQuizCount) {
    const { error } = await supabase
      .from("stories")
      .update({
        is_featured: !story.is_featured,
      })
      .eq("id", story.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchStories();
  }

  async function handleDelete(story: StoryWithQuizCount) {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus cerita "${story.title}"? Data quiz, bookmark, progress, dan nilai quiz yang terkait cerita ini juga bisa ikut terdampak.`
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("stories").delete().eq("id", story.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchStories();
  }

  const totalWithQuiz = stories.filter((story) => story.quiz_count > 0).length;
  const totalWithoutQuiz = stories.filter((story) => story.quiz_count === 0).length;
  const totalFeatured = stories.filter((story) => story.is_featured).length;

  return (
    <section className="mt-10 rounded-3xl bg-white p-5 shadow-xl dark:bg-[#102C3D] md:p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0B2538] dark:text-white">
            Daftar Cerita
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
            Admin bisa mencari, memfilter, dan mengelola cerita yang tersimpan
            di database Supabase.
          </p>
        </div>

        <Link
          href="/admin/cerita/tambah"
          className="rounded-full bg-[#EF4F3A] px-7 py-4 text-center text-sm font-bold text-white shadow-lg shadow-[#EF4F3A]/25"
        >
          + Tambah Cerita
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[#FFF8E7] p-5 dark:bg-[#071722]">
          <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Total Cerita
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-[#0B2538] dark:text-white">
            {stories.length}
          </h3>
        </div>

        <div className="rounded-2xl bg-[#FFF8E7] p-5 dark:bg-[#071722]">
          <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Sudah Ada Quiz
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-green-600">
            {totalWithQuiz}
          </h3>
        </div>

        <div className="rounded-2xl bg-[#FFF8E7] p-5 dark:bg-[#071722]">
          <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Tampil di Beranda
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-[#F6B23C]">
            {totalFeatured}
          </h3>
        </div>
      </div>

      <div className="mb-6 rounded-3xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_120px]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Cari cerita
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul, provinsi, wilayah, slug..."
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-medium text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Status Quiz
            </span>

            <select
              value={quizFilter}
              onChange={(event) => setQuizFilter(event.target.value)}
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-bold text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            >
              <option value="semua">Semua</option>
              <option value="sudah">Sudah ada quiz</option>
              <option value="belum">Belum ada quiz</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Status Beranda
            </span>

            <select
              value={featuredFilter}
              onChange={(event) => setFeaturedFilter(event.target.value)}
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-bold text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            >
              <option value="semua">Semua</option>
              <option value="tampil">Tampil di beranda</option>
              <option value="belum">Belum tampil</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilter}
              className="h-14 w-full rounded-2xl border-2 border-[#0B2538]/15 px-5 font-extrabold text-[#0B2538] hover:border-[#EF4F3A] hover:text-[#EF4F3A] dark:border-white/15 dark:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#37576B] dark:text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            Menampilkan{" "}
            <span className="font-extrabold text-[#EF4F3A]">
              {filteredStories.length}
            </span>{" "}
            dari {stories.length} cerita
          </p>

          <p>
            Belum ada quiz:{" "}
            <span className="font-extrabold text-[#EF4F3A]">
              {totalWithoutQuiz}
            </span>
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl bg-[#FFF8E7] p-6 text-center dark:bg-[#071722]">
          <p className="font-bold text-[#0B2538] dark:text-white">
            Memuat daftar cerita...
          </p>
        </div>
      )}

      {message && !isLoading && (
        <div className="rounded-2xl bg-red-100 p-6 text-red-700">
          <p className="font-bold">Gagal memuat cerita</p>
          <p className="mt-2 text-sm">{message}</p>
        </div>
      )}

      {!isLoading && !message && filteredStories.length === 0 && (
        <div className="rounded-2xl bg-[#FFF8E7] p-6 text-center dark:bg-[#071722]">
          <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
            Cerita tidak ditemukan
          </h3>

          <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
            Coba gunakan kata kunci atau filter yang berbeda.
          </p>

          <button
            type="button"
            onClick={resetFilter}
            className="mt-5 rounded-full bg-[#EF4F3A] px-6 py-3 font-bold text-white"
          >
            Reset Filter
          </button>
        </div>
      )}

      {!isLoading && !message && filteredStories.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-[#37576B] dark:text-white/70">
                <th className="py-4 pr-4">Judul</th>
                <th className="py-4 pr-4">Provinsi</th>
                <th className="py-4 pr-4">Wilayah</th>
                <th className="py-4 pr-4">Slug</th>
                <th className="py-4 pr-4">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredStories.map((story) => (
                <tr
                  key={story.id}
                  className="border-b border-white/10 align-top text-sm"
                >
                  <td className="max-w-[240px] py-5 pr-4">
                    <p className="font-extrabold text-[#0B2538] dark:text-white">
                      {story.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[#37576B] dark:text-white/60">
                      {story.summary}
                    </p>
                  </td>

                  <td className="py-5 pr-4 text-[#37576B] dark:text-white/80">
                    {story.province}
                  </td>

                  <td className="py-5 pr-4 text-[#37576B] dark:text-white/80">
                    {story.region}
                  </td>

                  <td className="max-w-[160px] py-5 pr-4 text-[#37576B] dark:text-white/80">
                    <span className="break-words">{story.slug}</span>
                  </td>



                  <td className="py-5 pr-0">
                    <div className="flex items-start gap-2">
                      <Link
                        href={`/cerita/${story.slug}`}
                        className="rounded-full border border-white/20 px-4 py-2 font-bold text-white transition hover:bg-white/10"
                      >
                        Lihat
                      </Link>

                      <Link
                        href={`/admin/cerita/${story.id}/edit`}
                        className="rounded-full bg-[#0E5A78] px-4 py-2 font-bold text-white transition hover:bg-[#0E5A78]/80"
                      >
                        Edit
                      </Link>

                      <details className="relative">
                        <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5 text-xl font-bold text-white transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                          ⋮
                        </summary>

                        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0B2538] shadow-lg">
                          <Link
                            href={`/admin/cerita/${story.id}/quiz`}
                            className="block px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            Kelola Quiz
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(story)}
                            className="block w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            {story.is_featured ? "Hapus dari Beranda" : "Tampilkan di Beranda"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(story)}
                            className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                          >
                            Hapus Cerita
                          </button>
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}