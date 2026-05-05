"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

type ReaderActionsProps = {
  storyId: string;
  contentSelector?: string;
};

type ReadingProgressRow = {
  id: string;
  progress_percent: number;
  last_paragraph_index: number;
  scroll_position: number;
};

export default function ReaderActions({
  storyId,
  contentSelector = "#story-content",
}: ReaderActionsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [lastParagraphIndex, setLastParagraphIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [message, setMessage] = useState("");
  const [isBookmarkSaved, setIsBookmarkSaved] = useState(false);

  const latestProgressRef = useRef(0);
  const latestParagraphRef = useRef(0);
  const latestScrollRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadReaderData() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      setIsBookmarkSaved(Boolean(bookmarkData));

      const { data: progressData, error: progressError } = await supabase
        .from("reading_progress")
        .select("id, progress_percent, last_paragraph_index, scroll_position")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle<ReadingProgressRow>();

      if (progressError) {
        setMessage(progressError.message);
        return;
      }

      if (progressData) {
        setProgressId(progressData.id);
        setProgress(progressData.progress_percent ?? 0);
        setLastParagraphIndex(progressData.last_paragraph_index ?? 0);
        setScrollPosition(progressData.scroll_position ?? 0);

        latestProgressRef.current = progressData.progress_percent ?? 0;
        latestParagraphRef.current = progressData.last_paragraph_index ?? 0;
        latestScrollRef.current = progressData.scroll_position ?? 0;
      } else {
        const { data: newProgressData, error: insertError } = await supabase
          .from("reading_progress")
          .upsert(
            {
              user_id: user.id,
              story_id: storyId,
              progress_percent: 0,
              last_paragraph_index: 0,
              scroll_position: 0,
            },
            {
              onConflict: "user_id,story_id",
              ignoreDuplicates: false,
            }
          )
          .select("id, progress_percent, last_paragraph_index, scroll_position")
          .single<ReadingProgressRow>();

        if (insertError) {
          setMessage(
            "Progress membaca gagal disiapkan. Silakan refresh halaman atau login ulang."
          );
          return;
        }

        setProgressId(newProgressData.id);
        setMessage("");
      }
    }

    loadReaderData();
  }, [storyId]);

  useEffect(() => {
    if (!isLoggedIn || !progressId) return;

    function calculateReadingProgress() {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const contentRect = contentElement.getBoundingClientRect();
      const contentTop = window.scrollY + contentRect.top;
      const contentHeight = contentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const currentScroll = window.scrollY;
      const readableDistance = Math.max(contentHeight - viewportHeight * 0.5, 1);
      const rawProgress =
        ((currentScroll - contentTop + viewportHeight * 0.35) / readableDistance) *
        100;

      const nextProgress = Math.max(0, Math.min(100, Math.round(rawProgress)));

      const paragraphs = Array.from(
        contentElement.querySelectorAll("[data-paragraph-index]")
      );

      let currentParagraphIndex = 0;

      paragraphs.forEach((paragraph) => {
        const paragraphElement = paragraph as HTMLElement;
        const rect = paragraphElement.getBoundingClientRect();

        if (rect.top <= viewportHeight * 0.45) {
          const index = Number(paragraphElement.dataset.paragraphIndex ?? 0);
          currentParagraphIndex = index;
        }
      });

      latestProgressRef.current = nextProgress;
      latestParagraphRef.current = currentParagraphIndex;
      latestScrollRef.current = Math.round(currentScroll);

      setProgress(nextProgress);
      setLastParagraphIndex(currentParagraphIndex);
      setScrollPosition(Math.round(currentScroll));

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveProgress();
      }, 1200);
    }

    async function saveProgress() {
      if (!progressId) return;

      const { error } = await supabase
        .from("reading_progress")
        .update({
          progress_percent: latestProgressRef.current,
          last_paragraph_index: latestParagraphRef.current,
          scroll_position: latestScrollRef.current,
        })
        .eq("id", progressId);

      if (error) {
        setMessage(error.message);
      }
    }

    window.addEventListener("scroll", calculateReadingProgress);
    calculateReadingProgress();

    return () => {
      window.removeEventListener("scroll", calculateReadingProgress);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isLoggedIn, progressId, contentSelector]);

  async function handleBookmark() {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMessage("Login dulu untuk menyimpan bookmark.");
      return;
    }

    if (isBookmarkSaved) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("story_id", storyId);

      if (error) {
        setMessage(error.message);
        return;
      }

      setIsBookmarkSaved(false);
      setMessage("Bookmark dihapus.");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      story_id: storyId,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setIsBookmarkSaved(true);
    setMessage("Cerita berhasil disimpan ke bookmark.");
  }

  async function handleMarkAsFinished() {
    if (!progressId) {
      setMessage("Login dulu untuk menyimpan progress.");
      return;
    }

    const documentHeight = document.documentElement.scrollHeight;
    const nextScrollPosition = Math.max(documentHeight - window.innerHeight, 0);

    const { error } = await supabase
      .from("reading_progress")
      .update({
        progress_percent: 100,
        last_paragraph_index: 9999,
        scroll_position: Math.round(nextScrollPosition),
      })
      .eq("id", progressId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setProgress(100);
    setLastParagraphIndex(9999);
    setScrollPosition(Math.round(nextScrollPosition));
    setMessage("Cerita ditandai selesai dibaca.");
  }

  function handleContinueReading() {
    if (!scrollPosition || scrollPosition <= 0) {
      const contentElement = document.querySelector(contentSelector);
      contentElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }

  if (!isLoggedIn) {
    return (
      <div className="mt-6 rounded-3xl bg-[#FFF8E7] p-5 dark:bg-[#071722]">
        <p className="text-sm leading-6 text-[#37576B] dark:text-white/70">
          Kamu tetap bisa membaca tanpa login. Login dibutuhkan untuk menyimpan
          progress membaca dan bookmark.
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#EF4F3A] px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#EF4F3A]/20 transition hover:-translate-y-0.5 hover:bg-[#d94431]"
        >
          Login untuk Simpan Progress
        </Link>

        <p className="mt-3 text-center text-xs leading-5 text-[#37576B] dark:text-white/50">
          Setelah login, progress membaca dan bookmark akan tersimpan di akun kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-3xl bg-[#FFF8E7] p-5 dark:bg-[#071722]">
        <p className="text-sm font-extrabold text-[#0B2538] dark:text-white">
          Progress membaca saat ini
        </p>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#0B2538]/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[#EF4F3A] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm font-semibold text-[#37576B] dark:text-white/70">
          {progress}% selesai
        </p>

        {lastParagraphIndex > 0 && progress < 100 && (
          <p className="mt-1 text-xs text-[#37576B] dark:text-white/50">
            Terakhir terbaca sekitar paragraf {lastParagraphIndex + 1}.
          </p>
        )}

        {progress >= 100 && (
          <p className="mt-1 text-xs font-bold text-green-600">
            Cerita sudah selesai dibaca.
          </p>
        )}

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={handleContinueReading}
            className="rounded-full bg-[#0E5A78] px-5 py-3 text-sm font-bold text-white"
          >
            Lanjutkan Membaca
          </button>

          <button
            type="button"
            onClick={handleMarkAsFinished}
            className="rounded-full bg-[#EF4F3A] px-5 py-3 text-sm font-bold text-white"
          >
            Tandai Selesai
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            className="rounded-full border-2 border-[#0B2538]/15 px-5 py-3 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            {isBookmarkSaved ? "Hapus Bookmark" : "Simpan Bookmark"}
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}
    </div>
  );
}