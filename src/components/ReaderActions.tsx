"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type ReaderActionsProps = {
  storyId: string;
};

export default function ReaderActions({ storyId }: ReaderActionsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setUserId(null);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      setIsBookmarked(Boolean(bookmarkData));

      const { data: progressData } = await supabase
        .from("reading_progress")
        .select("progress_percent")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      setProgress(progressData?.progress_percent ?? 0);
      setIsLoading(false);
    }

    loadUserData();
  }, [storyId]);

  async function toggleBookmark() {
    setMessage("");

    if (!userId) {
      setMessage("Silakan login dulu untuk menyimpan bookmark.");
      return;
    }

    if (isBookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("story_id", storyId);

      if (error) {
        setMessage(error.message);
        return;
      }

      setIsBookmarked(false);
      setMessage("Bookmark dihapus.");
    } else {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: userId,
        story_id: storyId,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setIsBookmarked(true);
      setMessage("Cerita berhasil disimpan ke bookmark.");
    }
  }

  async function saveProgress(value: number) {
    setMessage("");

    if (!userId) {
      setMessage("Silakan login dulu untuk menyimpan progress membaca.");
      return;
    }

    const { error } = await supabase.from("reading_progress").upsert(
      {
        user_id: userId,
        story_id: storyId,
        progress_percent: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,story_id",
      }
    );

    if (error) {
      setMessage(error.message);
      return;
    }

    setProgress(value);
    setMessage(`Progress membaca disimpan: ${value}%.`);
  }

  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
        <p className="text-sm font-bold text-[#0B2538] dark:text-white">
          Memuat fitur pembaca...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="rounded-2xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
        <p className="text-sm font-bold text-[#0B2538] dark:text-white">
          Progress membaca
        </p>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#0E5A78]/15">
          <div
            className="h-full rounded-full bg-[#EF4F3A]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
          {progress}% selesai
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => saveProgress(25)}
            className="rounded-full border border-[#0B2538]/20 px-3 py-2 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            25%
          </button>

          <button
            type="button"
            onClick={() => saveProgress(50)}
            className="rounded-full border border-[#0B2538]/20 px-3 py-2 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            50%
          </button>

          <button
            type="button"
            onClick={() => saveProgress(75)}
            className="rounded-full border border-[#0B2538]/20 px-3 py-2 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            75%
          </button>

          <button
            type="button"
            onClick={() => saveProgress(100)}
            className="rounded-full bg-[#EF4F3A] px-3 py-2 text-sm font-bold text-white"
          >
            Selesai
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleBookmark}
        className="mt-5 w-full rounded-full border-2 border-[#0B2538]/20 px-5 py-3 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
      >
        {isBookmarked ? "Hapus Bookmark" : "Simpan Bookmark"}
      </button>

      {!userId && (
        <p className="mt-3 text-xs leading-5 text-[#37576B] dark:text-white/60">
          *Login diperlukan untuk menyimpan bookmark dan progress membaca.
        </p>
      )}

      {message && (
        <p className="mt-4 rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}
    </div>
  );
}