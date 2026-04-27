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

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminStoryForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

    function handleProvinceChange(value: string) {
        setProvince(value);
        setRegion(getRegionFromProvince(value));
    }

  const [province, setProvince] = useState("Aceh");
  const [region, setRegion] = useState("Sumatera");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [moral, setMoral] = useState("");

  const [imageUrl, setImageUrl] = useState("/cerita.png");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

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

      const { error } = await supabase.from("stories").insert({
        title,
        slug,
        province,
        region,
        summary,
        image_url: finalImageUrl,
        content: paragraphs,
        moral,
      });

      if (error) {
        if (error.code === "23505") {
          setMessage(
            `Cerita "${title}" sudah ditambahkan dalam katalog. Silakan masukkan cerita yang belum ada.`
          );
        } else {
          setMessage(error.message);
        }

        setIsLoading(false);
        return;
      }

      setMessage("Cerita berhasil ditambahkan.");
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
        className="mt-10 rounded-3xl bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0B2538] dark:text-white">
            Tambah Cerita Baru
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
            Isi data cerita rakyat yang akan ditampilkan di katalog website.
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
            onChange={(event) => handleTitleChange(event.target.value)}
            required
            placeholder="Contoh: Malin Kundang"
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
            placeholder="contoh: malin-kundang"
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
          placeholder="Tulis ringkasan singkat cerita..."
          className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Upload Gambar Cerita
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
            Format yang disarankan: JPG, PNG, atau WebP. Kalau upload gambar,
            URL akan otomatis disimpan ke database.
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            URL Gambar Manual
          </span>

          <input
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/cerita.png"
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />

          <p className="mt-2 text-xs text-[#37576B] dark:text-white/60">
            Ini dipakai kalau admin tidak mengupload file gambar.
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
          placeholder={"Tulis isi cerita di sini.\n\nPisahkan paragraf dengan enter."}
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
          placeholder="Tulis pesan moral dari cerita..."
          className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
        />
      </label>

      {message && (
        <p
          className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${
            message.includes("sudah pernah") || message.includes("sudah digunakan")
              ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
              : "bg-[#0E5A78]/10 text-[#0B2538] dark:bg-white/10 dark:text-white"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-7 rounded-full bg-[#EF4F3A] px-8 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Menyimpan..." : "Simpan Cerita"}
      </button>
    </form>
  );
}