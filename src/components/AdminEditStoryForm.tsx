"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { uploadStoryImage } from "../lib/uploadStoryImage";
import {
  getRegionFromProvince,
  provinceOptions,
  regionOptions,
} from "../data/indonesiaRegions";

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  province: string;
  region: string;
  summary: string;
  image_url: string;
  content: string[];
  moral: string;
};

type AdminEditStoryFormProps = {
  story: StoryRow;
};

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminEditStoryForm({ story }: AdminEditStoryFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(story.title);
  const [slug, setSlug] = useState(story.slug);
  const [province, setProvince] = useState(story.province);
  const [region, setRegion] = useState(story.region);

    function handleProvinceChange(value: string) {
    setProvince(value);
    setRegion(getRegionFromProvince(value));
    }
  
    const [summary, setSummary] = useState(story.summary);
  const [imageUrl, setImageUrl] = useState(story.image_url || "/cerita.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState(story.content.join("\n\n"));
  const [moral, setMoral] = useState(story.moral);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const paragraphs = content
        .split("\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      if (paragraphs.length === 0) {
        setMessage("Isi cerita tidak boleh kosong.");
        setIsLoading(false);
        return;
      }

      let finalImageUrl = imageUrl || "/cerita.png";

      if (imageFile) {
        setMessage("Mengupload gambar...");
        finalImageUrl = await uploadStoryImage(imageFile);
      }

      const { error } = await supabase
        .from("stories")
        .update({
          title,
          slug,
          province,
          region,
          summary,
          image_url: finalImageUrl,
          content: paragraphs,
          moral,
        })
        .eq("id", story.id);

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      setMessage("Cerita berhasil diperbarui.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Terjadi kesalahan saat upload gambar.");
      }

      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0B2538] dark:text-white">
            Edit Cerita
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
            Ubah data cerita yang sudah tersimpan di database Supabase.
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-full border-2 border-[#0B2538]/20 px-6 py-3 text-center text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
        >
          Kembali
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Judul Cerita
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Slug URL
          </span>
          <input
            type="text"
            value={slug}
            onChange={(event) => setSlug(createSlug(event.target.value))}
            required
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>

        <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Provinsi
        </span>

        <select
            value={province}
            onChange={(event) => handleProvinceChange(event.target.value)}
            required
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 font-bold text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        >
            {provinceOptions.map((provinceName) => (
            <option key={provinceName} value={provinceName}>
                {provinceName}
            </option>
            ))}
        </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Wilayah
          </span>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 font-bold text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          >
            {regionOptions.map((regionName) => (
            <option key={regionName} value={regionName}>
                {regionName}
            </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
          Ringkasan Cerita
        </span>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
          rows={3}
          className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Upload Gambar Baru
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setImageFile(file);
            }}
            className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />

          {imageFile && (
            <p className="mt-2 text-sm font-semibold text-[#0E5A78] dark:text-white">
              File dipilih: {imageFile.name}
            </p>
          )}

          <p className="mt-2 text-xs text-[#37576B] dark:text-white/60">
            Kalau upload gambar baru, URL gambar di database akan otomatis
            diganti.
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            URL Gambar Saat Ini
          </span>

          <input
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/cerita.png"
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />

          <p className="mt-2 text-xs text-[#37576B] dark:text-white/60">
            Jika tidak upload file baru, URL ini yang tetap digunakan.
          </p>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
          Isi Cerita
        </span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          rows={10}
          className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        />
        <p className="mt-2 text-xs text-[#37576B] dark:text-white/60">
          Setiap paragraf dipisahkan dengan enter.
        </p>
      </label>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
          Pesan Moral
        </span>
        <textarea
          value={moral}
          onChange={(event) => setMoral(event.target.value)}
          required
          rows={3}
          className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        />
      </label>

      {message && (
        <p className="mt-5 rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-[#EF4F3A] px-8 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <Link
          href={`/cerita/${slug}`}
          className="rounded-full border-2 border-[#0B2538]/20 px-8 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
        >
          Lihat Cerita
        </Link>
      </div>
    </form>
  );
}