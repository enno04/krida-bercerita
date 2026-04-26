"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type Profile = {
  full_name: string | null;
  role: "user" | "admin";
};

type BookmarkRow = {
  id: string;
  story_id: string;
  stories: {
    id: string;
    slug: string;
    title: string;
    province: string;
    region: string;
    summary: string;
    image_url: string;
  } | null;
};

type ProgressRow = {
  id: string;
  story_id: string;
  progress_percent: number;
  updated_at: string;
  stories: {
    id: string;
    slug: string;
    title: string;
    province: string;
    region: string;
    summary: string;
    image_url: string;
  } | null;
};

type QuizResultRow = {
  id: string;
  story_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  stories: {
    id: string;
    slug: string;
    title: string;
    province: string;
    region: string;
    summary: string;
    image_url: string;
  } | null;
};

type UserDashboardContentProps = {
  profile: Profile;
};

export default function UserDashboardContent({
  profile,
}: UserDashboardContentProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [progressList, setProgressList] = useState<ProgressRow[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchDashboardData() {
    setIsLoading(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMessage("Sesi login tidak ditemukan. Silakan login ulang.");
      setIsLoading(false);
      return;
    }

    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from("bookmarks")
      .select(
        `
        id,
        story_id,
        stories (
          id,
          slug,
          title,
          province,
          region,
          summary,
          image_url
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (bookmarkError) {
      setMessage(bookmarkError.message);
      setIsLoading(false);
      return;
    }

    const { data: progressData, error: progressError } = await supabase
      .from("reading_progress")
      .select(
        `
        id,
        story_id,
        progress_percent,
        updated_at,
        stories (
          id,
          slug,
          title,
          province,
          region,
          summary,
          image_url
        )
      `
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (progressError) {
      setMessage(progressError.message);
      setIsLoading(false);
      return;
    }

    const { data: quizData, error: quizError } = await supabase
    .from("quiz_results")
    .select(
        `
        id,
        story_id,
        score,
        total_questions,
        created_at,
        stories (
        id,
        slug,
        title,
        province,
        region,
        summary,
        image_url
        )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

    if (quizError) {
    setMessage(quizError.message);
    setIsLoading(false);
    return;
    }

    setBookmarks((bookmarkData ?? []) as unknown as BookmarkRow[]);
    setProgressList((progressData ?? []) as unknown as ProgressRow[]);
    setQuizResults((quizData ?? []) as unknown as QuizResultRow[]);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function handleRemoveBookmark(bookmarkId: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus bookmark ini?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Bookmark berhasil dihapus.");
    fetchDashboardData();
  }

  if (isLoading) {
    return (
      <div className="mt-10 rounded-[32px] bg-white p-8 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
        <p className="font-bold text-[#0B2538] dark:text-white">
          Memuat dashboard user...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      {message && (
        <p className="rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
          <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Bookmark
          </p>
          <h2 className="mt-2 text-4xl font-extrabold text-[#0B2538] dark:text-white">
            {bookmarks.length}
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/60">
            Cerita tersimpan
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
          <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Progress
          </p>
          <h2 className="mt-2 text-4xl font-extrabold text-[#0B2538] dark:text-white">
            {progressList.length}
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/60">
            Cerita pernah dibaca
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
        <p className="text-sm font-bold text-[#37576B] dark:text-white/70">
            Riwayat Quiz
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-[#0B2538] dark:text-white">
            {quizResults.length}
        </h2>
        <p className="mt-2 text-sm text-[#37576B] dark:text-white/60">
            Quiz selesai
        </p>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] md:rounded-[32px] md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Lanjut Membaca
            </h2>
            <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
              Cerita yang progress membacanya sudah kamu simpan.
            </p>
          </div>

          <Link
            href="/katalog"
            className="rounded-full bg-[#EF4F3A] px-6 py-3 text-center text-sm font-bold text-white"
          >
            Cari Cerita
          </Link>
        </div>

        {progressList.length === 0 ? (
          <div className="rounded-[24px] bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada progress membaca
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Buka cerita, lalu simpan progress membaca agar muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {progressList.map((item) => {
              if (!item.stories) return null;

              return (
                <article
                  key={item.id}
                  className="rounded-[24px] bg-[#FFF8E7] p-5 dark:bg-[#071722]"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#EF4F3A]">
                        {item.stories.province}
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold text-[#0B2538] dark:text-white">
                        {item.stories.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
                        {item.stories.summary}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#F6B23C]/20 px-3 py-1 text-xs font-extrabold text-[#8A5A00]">
                      {item.progress_percent}%
                    </span>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#0E5A78]/15">
                    <div
                      className="h-full rounded-full bg-[#EF4F3A]"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/cerita/${item.stories.slug}`}
                      className="rounded-full bg-[#0B2538] px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#0B2538]"
                    >
                      Lanjut Membaca
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
                Nilai Terbaik Quiz
                </h2>
                <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
                Nilai terbaik dari setiap cerita yang sudah kamu kerjakan akan muncul di sini.
                </p>
            </div>

            {quizResults.length === 0 ? (
                <div className="rounded-[24px] bg-[#FFF8E7] p-6 dark:bg-[#071722]">
                <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
                    Belum ada nilai quiz
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
                    Kerjakan quiz setelah membaca cerita agar nilai terbaikmu tersimpan di sini.
                </p>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                {quizResults.map((item) => {
                    if (!item.stories) return null;

                    const percentage = Math.round(
                    (item.score / item.total_questions) * 100
                    );

                    return (
                    <article
                        key={item.id}
                        className="rounded-[24px] bg-[#FFF8E7] p-5 dark:bg-[#071722]"
                    >
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#EF4F3A]">
                        {item.stories.province}
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-[#0B2538] dark:text-white">
                        {item.stories.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-[#F6B23C]/20 px-3 py-1 text-xs font-extrabold text-[#8A5A00]">
                            Nilai {item.score}/{item.total_questions}
                        </span>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
                            {percentage}%
                        </span>
                        </div>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#0E5A78]/15">
                        <div
                            className="h-full rounded-full bg-[#EF4F3A]"
                            style={{ width: `${percentage}%` }}
                        />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href={`/quiz/${item.stories.slug}`}
                            className="rounded-full bg-[#EF4F3A] px-5 py-3 text-sm font-bold text-white"
                        >
                            Ulangi Quiz
                        </Link>

                        <Link
                            href={`/cerita/${item.stories.slug}`}
                            className="rounded-full border-2 border-[#0B2538]/20 px-5 py-3 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                        >
                            Baca Cerita
                        </Link>
                        </div>
                    </article>
                    );
                })}
                </div>
            )}
        </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
            Bookmark Cerita
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
            Cerita yang kamu simpan untuk dibaca lagi.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-[24px] bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada bookmark
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Buka cerita lalu klik Simpan Bookmark agar muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {bookmarks.map((item) => {
              if (!item.stories) return null;

              return (
                <article
                  key={item.id}
                  className="rounded-[24px] bg-[#FFF8E7] p-5 dark:bg-[#071722]"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#EF4F3A]">
                    {item.stories.province}
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-[#0B2538] dark:text-white">
                    {item.stories.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
                    {item.stories.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/cerita/${item.stories.slug}`}
                      className="rounded-full bg-[#EF4F3A] px-5 py-3 text-sm font-bold text-white"
                    >
                      Baca Cerita
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(item.id)}
                      className="rounded-full border-2 border-[#0B2538]/20 px-5 py-3 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                    >
                      Hapus Bookmark
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}