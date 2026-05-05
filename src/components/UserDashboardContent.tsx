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
  last_paragraph_index: number;
  scroll_position: number;
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

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function matchStorySearch(
  story: {
    title: string;
    province: string;
    region: string;
    summary: string;
  },
  keyword: string
) {
  const searchText = keyword.toLowerCase().trim();

  if (!searchText) return true;

  return (
    story.title.toLowerCase().includes(searchText) ||
    story.province.toLowerCase().includes(searchText) ||
    story.region.toLowerCase().includes(searchText) ||
    story.summary.toLowerCase().includes(searchText)
  );
}

export default function UserDashboardContent({
  profile,
}: UserDashboardContentProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [progressList, setProgressList] = useState<ProgressRow[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [progressSearch, setProgressSearch] = useState("");
  const [quizSearch, setQuizSearch] = useState("");
  const [bookmarkSearch, setBookmarkSearch] = useState("");

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
        last_paragraph_index,
        scroll_position,
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

  const filteredProgressList = progressList.filter((item) => {
    if (!item.stories) return false;
    return matchStorySearch(item.stories, progressSearch);
  });

  const filteredQuizResults = quizResults.filter((item) => {
    if (!item.stories) return false;
    return matchStorySearch(item.stories, quizSearch);
  });

  const filteredBookmarks = bookmarks.filter((item) => {
    if (!item.stories) return false;
    return matchStorySearch(item.stories, bookmarkSearch);
  });

  async function handleRemoveBookmark(bookmarkId: string) {
    const confirmDelete = window.confirm("Yakin ingin menghapus bookmark ini?");

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

  async function handleRemoveProgress(progressId: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus history membaca ini?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("reading_progress")
      .delete()
      .eq("id", progressId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("History membaca berhasil dihapus.");
    fetchDashboardData();
  }

  async function handleRemoveQuizResult(resultId: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus history nilai quiz ini?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("quiz_results")
      .delete()
      .eq("id", resultId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("History nilai quiz berhasil dihapus.");
    fetchDashboardData();
  }

  if (isLoading) {
    return (
      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl dark:bg-[#102C3D]">
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
        <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#102C3D]">
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

        <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#102C3D]">
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

        <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#102C3D]">
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

      <section className="rounded-3xl bg-white p-5 shadow-xl dark:bg-[#102C3D] md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Lanjut Membaca
            </h2>
            <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
              Cerita yang progress membacanya tersimpan otomatis saat kamu
              membaca.
            </p>
          </div>

          <Link
            href="/katalog"
            className="rounded-full bg-[#EF4F3A] px-6 py-3 text-center text-sm font-bold text-white"
          >
            Mulai Membaca
          </Link>
        </div>

        <div className="mb-6 rounded-3xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Cari cerita
            </span>

            <input
              type="text"
              value={progressSearch}
              onChange={(event) => setProgressSearch(event.target.value)}
              placeholder="Cari judul cerita, provinsi, atau wilayah..."
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-medium text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            />
          </label>

          <p className="mt-3 text-sm font-semibold text-[#37576B] dark:text-white/70">
            Menampilkan{" "}
            <span className="font-extrabold text-[#EF4F3A]">
              {filteredProgressList.length}
            </span>{" "}
            dari {progressList.length} history membaca
          </p>
        </div>

        {progressList.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada progress membaca
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Buka cerita dan scroll saat membaca. Progress akan tersimpan
              otomatis jika kamu sudah login.
            </p>
          </div>
        ) : filteredProgressList.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              History membaca tidak ditemukan
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Coba gunakan kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredProgressList.map((item) => {
              if (!item.stories) return null;

              return (
                <article
                  key={item.id}
                  className="rounded-3xl bg-[#FFF8E7] p-5 dark:bg-[#071722]"
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

                    <span className="w-fit rounded-full bg-[#F6B23C]/20 px-3 py-1 text-xs font-extrabold text-[#8A5A00] dark:text-[#F6B23C]">
                      {item.progress_percent}%
                    </span>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#0E5A78]/15">
                    <div
                      className="h-full rounded-full bg-[#EF4F3A]"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-[#37576B] dark:text-white/70">
                    {item.progress_percent >= 100 ? (
                      <p className="font-bold text-green-600">
                        Cerita sudah selesai dibaca.
                      </p>
                    ) : (
                      <p>
                        Terakhir terbaca sekitar paragraf{" "}
                        <span className="font-extrabold text-[#0B2538] dark:text-white">
                          {(item.last_paragraph_index ?? 0) + 1}
                        </span>
                        .
                      </p>
                    )}

                    <p className="text-xs text-[#37576B]/70 dark:text-white/50">
                      Terakhir diperbarui: {formatDate(item.updated_at)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/cerita/${item.stories.slug}?continue=1`}
                      className="rounded-full bg-[#0B2538] px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#0B2538]"
                    >
                      Lanjutkan Membaca
                    </Link>

                    <Link
                      href={`/cerita/${item.stories.slug}`}
                      className="rounded-full border-2 border-[#0B2538]/20 px-5 py-3 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                    >
                      Mulai dari Awal
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveProgress(item.id)}
                      className="rounded-full bg-red-100 px-5 py-3 text-sm font-bold text-red-700"
                    >
                      Hapus History
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#102C3D]">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
            Nilai Terbaik Quiz
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
            Nilai terbaik dari setiap cerita yang sudah kamu kerjakan akan
            muncul di sini.
          </p>
        </div>

        <div className="mb-6 rounded-3xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Cari nilai quiz
            </span>

            <input
              type="text"
              value={quizSearch}
              onChange={(event) => setQuizSearch(event.target.value)}
              placeholder="Cari judul cerita, provinsi, atau wilayah..."
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-medium text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            />
          </label>

          <p className="mt-3 text-sm font-semibold text-[#37576B] dark:text-white/70">
            Menampilkan{" "}
            <span className="font-extrabold text-[#EF4F3A]">
              {filteredQuizResults.length}
            </span>{" "}
            dari {quizResults.length} nilai quiz
          </p>
        </div>

        {quizResults.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada nilai quiz
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Kerjakan quiz setelah membaca cerita agar nilai terbaikmu
              tersimpan di sini.
            </p>
          </div>
        ) : filteredQuizResults.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Nilai quiz tidak ditemukan
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Coba gunakan kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredQuizResults.map((item) => {
              if (!item.stories) return null;

              const percentage = Math.round(
                (item.score / item.total_questions) * 100
              );

              return (
                <article
                  key={item.id}
                  className="rounded-3xl bg-[#FFF8E7] p-5 dark:bg-[#071722]"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#EF4F3A]">
                    {item.stories.province}
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-[#0B2538] dark:text-white">
                    {item.stories.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#F6B23C]/20 px-3 py-1 text-xs font-extrabold text-[#8A5A00] dark:text-[#F6B23C]">
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

                    <button
                      type="button"
                      onClick={() => handleRemoveQuizResult(item.id)}
                      className="rounded-full bg-red-100 px-5 py-3 text-sm font-bold text-red-700"
                    >
                      Hapus Nilai
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-[#102C3D]">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
            Bookmark Cerita
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
            Cerita yang kamu simpan untuk dibaca lagi.
          </p>
        </div>

        <div className="mb-6 rounded-3xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Cari bookmark
            </span>

            <input
              type="text"
              value={bookmarkSearch}
              onChange={(event) => setBookmarkSearch(event.target.value)}
              placeholder="Cari judul cerita, provinsi, atau wilayah..."
              className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-white px-5 font-medium text-[#0B2538] outline-none focus:border-[#EF4F3A] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
            />
          </label>

          <p className="mt-3 text-sm font-semibold text-[#37576B] dark:text-white/70">
            Menampilkan{" "}
            <span className="font-extrabold text-[#EF4F3A]">
              {filteredBookmarks.length}
            </span>{" "}
            dari {bookmarks.length} bookmark
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada bookmark
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Buka cerita lalu klik Simpan Bookmark agar muncul di sini.
            </p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Bookmark tidak ditemukan
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Coba gunakan kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredBookmarks.map((item) => {
              if (!item.stories) return null;

              return (
                <article
                  key={item.id}
                  className="rounded-3xl bg-[#FFF8E7] p-5 dark:bg-[#071722]"
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