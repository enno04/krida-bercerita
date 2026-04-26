"use client";

import { useEffect, useState } from "react";
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

export default function AdminStoriesList() {
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchStories() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("stories")
      .select("id, slug, title, province, region, summary, image_url, is_featured, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setStories(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchStories();
  }, []);

    async function handleToggleFeatured(story: StoryRow) {
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
  
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus cerita ini? Data yang dihapus tidak bisa dikembalikan."
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("stories").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Cerita berhasil dihapus.");
    fetchStories();
  }

  if (isLoading) {
    return (
      <div className="mt-10 rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
        <p className="font-bold text-[#0B2538] dark:text-white">
          Memuat daftar cerita...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10 rounded-[28px] bg-white p-5 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] md:rounded-[32px] md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
            Daftar Cerita
          </h2>
          <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
            Admin bisa mengelola cerita yang tersimpan di database Supabase.
          </p>
        </div>

        <Link
          href="/admin/cerita/tambah"
          className="rounded-full bg-[#EF4F3A] px-6 py-3 text-center text-sm font-bold text-white"
        >
          + Tambah Cerita
        </Link>
      </div>

      {message && (
        <p className="mt-5 rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-[#0B2538]/10 text-left text-sm text-[#37576B] dark:border-white/10 dark:text-white/70">
              <th className="py-4 pr-4">Judul</th>
              <th className="py-4 pr-4">Provinsi</th>
              <th className="py-4 pr-4">Wilayah</th>
              <th className="py-4 pr-4">Slug</th>
              <th className="py-4 pr-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {stories.map((story) => (
              <tr
                key={story.id}
                className="border-b border-[#0B2538]/10 text-sm dark:border-white/10"
              >
                <td className="py-4 pr-4">
                  <div>
                    <p className="font-extrabold text-[#0B2538] dark:text-white">
                      {story.title}
                    </p>
                    <p className="mt-1 line-clamp-1 max-w-xs text-[#37576B] dark:text-white/60">
                      {story.summary}
                    </p>
                  </div>
                </td>

                <td className="py-4 pr-4 text-[#37576B] dark:text-white/70">
                  {story.province}
                </td>

                <td className="py-4 pr-4 text-[#37576B] dark:text-white/70">
                  {story.region}
                </td>

                <td className="py-4 pr-4 text-[#37576B] dark:text-white/70">
                  {story.slug}
                </td>

                <td className="py-4 pr-4">
                    <div className="flex min-w-max flex-wrap gap-2">
                    <Link
                        href={`/cerita/${story.slug}`}
                        className="rounded-full border border-[#0B2538]/20 px-4 py-2 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
                    >
                        Lihat
                    </Link>

                    <Link
                        href={`/admin/cerita/${story.id}/edit`}
                        className="rounded-full bg-[#0E5A78] px-4 py-2 font-bold text-white"
                    >
                        Edit
                    </Link>

                    <Link
                        href={`/admin/cerita/${story.id}/quiz`}
                        className="rounded-full bg-[#F6B23C] px-4 py-2 font-bold text-[#0B2538]"
                    >
                        Quiz
                    </Link>

                    <button
                        type="button"
                        onClick={() => handleToggleFeatured(story)}
                        className={`rounded-full px-4 py-2 font-bold ${
                            story.is_featured
                            ? "bg-green-100 text-green-700"
                            : "bg-[#F6B23C] text-[#0B2538]"
                        }`}
                        >
                        {story.is_featured ? "Sedang Di Tampilkan" : "Tampilkan di Beranda"}
                        </button>

                    <button
                        type="button"
                        onClick={() => handleDelete(story.id)}
                        className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700"
                    >
                        Hapus
                    </button>
                    </div>
                </td>
              </tr>
            ))}

            {stories.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-[#37576B] dark:text-white/70"
                >
                  Belum ada cerita di database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}