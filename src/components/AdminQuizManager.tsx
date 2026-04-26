"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type StoryInfo = {
  id: string;
  slug: string;
  title: string;
};

type QuizQuestion = {
  id: string;
  story_id: string;
  question: string;
  options: string[];
  answer: string;
  created_at: string;
};

type AdminQuizManagerProps = {
  story: StoryInfo;
};

export default function AdminQuizManager({ story }: AdminQuizManagerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchQuestions() {
    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("quiz_questions")
      .select("id, story_id, question, options, answer, created_at")
      .eq("story_id", story.id)
      .order("created_at", { ascending: true });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setQuestions(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");

    const options = [optionA, optionB, optionC, optionD]
      .map((option) => option.trim())
      .filter(Boolean);

    if (options.length < 2) {
      setMessage("Minimal isi 2 pilihan jawaban.");
      setIsSaving(false);
      return;
    }

    if (!options.includes(answer)) {
      setMessage("Jawaban benar harus sama persis dengan salah satu pilihan.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("quiz_questions").insert({
      story_id: story.id,
      question,
      options,
      answer,
    });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setAnswer("");
    setMessage("Pertanyaan quiz berhasil ditambahkan.");
    setIsSaving(false);
    fetchQuestions();
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus pertanyaan quiz ini?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Pertanyaan quiz berhasil dihapus.");
    fetchQuestions();
  }

  const answerOptions = [optionA, optionB, optionC, optionD].filter(Boolean);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
              Daftar Pertanyaan Quiz
            </h2>
            <p className="mt-2 text-sm text-[#37576B] dark:text-white/70">
              Quiz untuk cerita: <strong>{story.title}</strong>
            </p>
          </div>

          <Link
            href={`/quiz/${story.slug}`}
            className="rounded-full bg-[#EF4F3A] px-5 py-3 text-center text-sm font-bold text-white"
          >
            Preview Quiz
          </Link>
        </div>

        {message && (
          <p className="mb-5 rounded-2xl bg-[#0E5A78]/10 p-4 text-sm font-semibold text-[#0B2538] dark:bg-white/10 dark:text-white">
            {message}
          </p>
        )}

        {isLoading ? (
          <p className="font-bold text-[#0B2538] dark:text-white">
            Memuat pertanyaan quiz...
          </p>
        ) : questions.length === 0 ? (
          <div className="rounded-[24px] bg-[#FFF8E7] p-6 dark:bg-[#071722]">
            <h3 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
              Belum ada quiz
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
              Tambahkan pertanyaan pertama dari form di sebelah kanan.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((item, index) => (
              <article
                key={item.id}
                className="rounded-[24px] bg-[#FFF8E7] p-5 dark:bg-[#071722]"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#EF4F3A]">
                      Pertanyaan {index + 1}
                    </p>

                    <h3 className="mt-2 text-lg font-extrabold text-[#0B2538] dark:text-white">
                      {item.question}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="h-fit rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700"
                  >
                    Hapus
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  {item.options.map((option) => (
                    <div
                      key={option}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                        option === item.answer
                          ? "border-green-300 bg-green-100 text-green-800"
                          : "border-[#0B2538]/10 bg-white text-[#0B2538] dark:border-white/10 dark:bg-[#102C3D] dark:text-white"
                      }`}
                    >
                      {option}
                      {option === item.answer ? " ✓" : ""}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="h-fit rounded-[32px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] lg:sticky lg:top-28"
      >
        <h2 className="text-2xl font-extrabold text-[#0B2538] dark:text-white">
          Tambah Pertanyaan
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#37576B] dark:text-white/70">
          Buat pertanyaan pilihan ganda untuk cerita ini.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Pertanyaan
          </span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            required
            rows={3}
            placeholder="Contoh: Apa pesan moral utama dari cerita ini?"
            className="w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          />
        </label>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Pilihan A
            </span>
            <input
              type="text"
              value={optionA}
              onChange={(event) => setOptionA(event.target.value)}
              required
              className="h-13 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Pilihan B
            </span>
            <input
              type="text"
              value={optionB}
              onChange={(event) => setOptionB(event.target.value)}
              required
              className="h-13 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Pilihan C
            </span>
            <input
              type="text"
              value={optionC}
              onChange={(event) => setOptionC(event.target.value)}
              className="h-13 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
              Pilihan D
            </span>
            <input
              type="text"
              value={optionD}
              onChange={(event) => setOptionD(event.target.value)}
              className="h-13 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 py-4 text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-[#0B2538] dark:text-white">
            Jawaban Benar
          </span>
          <select
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            required
            className="h-14 w-full rounded-2xl border border-[#0B2538]/10 bg-[#FFF8E7] px-5 font-bold text-[#0B2538] outline-none dark:border-white/10 dark:bg-[#071722] dark:text-white"
          >
            <option value="">Pilih jawaban benar</option>
            {answerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-7 w-full rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pertanyaan"}
        </button>
      </form>
    </div>
  );
}