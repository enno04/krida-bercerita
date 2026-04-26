"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage(
      "Akun berhasil dibuat. Silakan masuk ke halaman login di sini."
    );

    setFullName("");
    setEmail("");
    setPassword("");
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D]"
    >
      <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
        Register
      </p>

      <h1 className="text-4xl font-extrabold text-[#0B2538] dark:text-white">
        Buat akun baru
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
        Akun user bisa dipakai untuk bookmark cerita, menyimpan progress baca,
        dan melihat riwayat quiz.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Nama Lengkap
          </span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            placeholder="Nama kamu"
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="nama@email.com"
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>
      </div>

      {message && (
        <p className="mt-5 rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-7 w-full rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Memproses..." : "Daftar"}
      </button>

      <p className="mt-6 text-center text-sm text-[#37576B] dark:text-white/70">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-extrabold text-[#EF4F3A]">
          Login di sini
        </Link>
      </p>
    </form>
  );
}