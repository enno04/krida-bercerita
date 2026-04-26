"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type StoryInfo = {
  id: string;  
  slug: string;
  title: string;
  summary: string;
  province: string;
  region: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type QuizClientProps = {
  story: StoryInfo;
  quiz: QuizQuestion[];
};

export default function QuizClient({ story, quiz }: QuizClientProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSavingResult, setIsSavingResult] = useState(false);

  const totalQuestions = quiz.length;

  const score = quiz.reduce((total, question, index) => {
    if (answers[index] === question.answer) {
      return total + 1;
    }

    return total;
  }, 0);

  function handleChooseAnswer(questionIndex: number, option: string) {
    if (isSubmitted) return;

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: option,
    }));
  }

    async function handleSubmit() {
    setIsSubmitted(true);
    setResultMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
        setResultMessage(
        "Nilai quiz tidak disimpan karena kamu belum login. Login untuk menyimpan nilai terbaik quiz."
        );
        return;
    }

    setIsSavingResult(true);

    const { data: existingResult, error: existingError } = await supabase
        .from("quiz_results")
        .select("id, score, total_questions")
        .eq("user_id", user.id)
        .eq("story_id", story.id)
        .maybeSingle();

    if (existingError) {
        setResultMessage(existingError.message);
        setIsSavingResult(false);
        return;
    }

    if (!existingResult) {
        const { error } = await supabase.from("quiz_results").insert({
        user_id: user.id,
        story_id: story.id,
        score,
        total_questions: totalQuestions,
        });

        if (error) {
        setResultMessage(error.message);
        setIsSavingResult(false);
        return;
        }

        setResultMessage("Nilai quiz berhasil disimpan sebagai nilai terbaik.");
        setIsSavingResult(false);
        return;
    }

    if (score > existingResult.score) {
        const { error } = await supabase
        .from("quiz_results")
        .update({
            score,
            total_questions: totalQuestions,
            created_at: new Date().toISOString(),
        })
        .eq("id", existingResult.id);

        if (error) {
        setResultMessage(error.message);
        setIsSavingResult(false);
        return;
        }

        setResultMessage(
        `Hebat! Nilai terbaik kamu diperbarui dari ${existingResult.score}/${existingResult.total_questions} menjadi ${score}/${totalQuestions}.`
        );
        setIsSavingResult(false);
        return;
    }

    setResultMessage(
        `Nilai terbaik kamu tetap ${existingResult.score}/${existingResult.total_questions}. Nilai percobaan kali ini adalah ${score}/${totalQuestions}.`
    );
    setIsSavingResult(false);
    }

    function handleReset() {
     setAnswers({});
     setIsSubmitted(false);
     setResultMessage("");
    }

  if (quiz.length === 0) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-[44px] bg-white p-8 shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D] md:p-10">
          <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
            Quiz Edukasi
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
            Quiz belum tersedia
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#37576B] dark:text-white/70">
            Quiz untuk cerita {story.title} belum ditambahkan oleh admin.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/cerita/${story.slug}`}
              className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white"
            >
              Baca Cerita
            </Link>

            <Link
              href="/katalog"
              className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
            >
              Pilih Cerita Lain
            </Link>
          </div>
        </section>

        <aside className="h-fit rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] lg:sticky lg:top-28">
          <h2 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
            Ringkasan Cerita
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
            {story.summary}
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="rounded-[44px] bg-white p-8 shadow-[0_18px_45px_rgba(11,37,56,0.13)] dark:bg-[#102C3D] md:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
            Quiz Edukasi
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0B2538] dark:text-white">
            Quiz: {story.title}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#37576B] dark:text-white/70">
            Jawab pertanyaan berikut untuk menguji pemahamanmu setelah membaca
            cerita. Kamu tetap bisa mengerjakan quiz tanpa login.
          </p>
        </div>

        <div className="space-y-6">
          {quiz.map((question, questionIndex) => (
            <div
              key={question.id}
              className="rounded-[28px] bg-[#FFF8E7] p-6 dark:bg-[#071722]"
            >
              <h2 className="text-lg font-extrabold text-[#0B2538] dark:text-white">
                {questionIndex + 1}. {question.question}
              </h2>

              <div className="mt-5 grid gap-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[questionIndex] === option;
                  const isCorrect = option === question.answer;
                  const isWrongSelected =
                    isSubmitted && isSelected && !isCorrect;

                  let optionClass =
                    "border-[#0B2538]/10 bg-white text-[#0B2538] dark:border-white/10 dark:bg-[#102C3D] dark:text-white";

                  if (isSelected && !isSubmitted) {
                    optionClass =
                      "border-[#EF4F3A] bg-[#EF4F3A]/10 text-[#0B2538] dark:text-white";
                  }

                  if (isSubmitted && isCorrect) {
                    optionClass =
                      "border-green-400 bg-green-100 text-green-800";
                  }

                  if (isWrongSelected) {
                    optionClass = "border-red-400 bg-red-100 text-red-800";
                  }

                  return (
                    <button
                      key={`${question.id}-${optionIndex}`}
                      type="button"
                      onClick={() => handleChooseAnswer(questionIndex, option)}
                      className={`rounded-2xl border-2 px-5 py-4 text-left font-semibold transition hover:-translate-y-0.5 ${optionClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
            <button
            type="button"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < totalQuestions || isSavingResult}
            className="rounded-full bg-[#EF4F3A] px-7 py-4 font-bold text-white shadow-lg shadow-[#EF4F3A]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {isSavingResult ? "Menyimpan..." : "Lihat Nilai"}
            </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border-2 border-[#0B2538]/20 px-7 py-4 font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            Ulangi Quiz
          </button>
        </div>

        {isSubmitted && (
          <div className="mt-8 rounded-[28px] bg-[#0E5A78]/10 p-6 dark:bg-white/10">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0E5A78] dark:text-white">
              Hasil Quiz
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[#0B2538] dark:text-white">
              Nilai kamu: {score}/{totalQuestions}
            </h2>

            <p className="mt-3 leading-7 text-[#37576B] dark:text-white/70">
              {score === totalQuestions
                ? "Bagus sekali! Kamu memahami cerita ini dengan sangat baik."
                : "Tetap semangat. Kamu bisa membaca ulang cerita lalu mencoba quiz lagi."}
            </p>

            {resultMessage && (
            <p className="mt-3 rounded-2xl bg-white/70 p-4 text-sm font-semibold text-[#0B2538] dark:bg-[#071722] dark:text-white">
                {resultMessage}
            </p>
            )}
          </div>
        )}
      </section>

      <aside className="h-fit rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(11,37,56,0.09)] dark:bg-[#102C3D] lg:sticky lg:top-28">
        <h2 className="text-xl font-extrabold text-[#0B2538] dark:text-white">
          Ringkasan Cerita
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#37576B] dark:text-white/70">
          {story.summary}
        </p>

        <div className="mt-5 rounded-2xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
          <p className="text-sm font-bold text-[#0B2538] dark:text-white">
            Asal cerita
          </p>

          <p className="mt-1 text-sm text-[#37576B] dark:text-white/70">
            {story.province}, wilayah {story.region}
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF8E7] p-4 dark:bg-[#071722]">
          <p className="text-sm font-bold text-[#0B2538] dark:text-white">
            Status login
          </p>

          <p className="mt-1 text-sm text-[#37576B] dark:text-white/70">
            Pengguna tanpa login tetap bisa mengerjakan quiz, tetapi nilai tidak disimpan.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href={`/cerita/${story.slug}`}
            className="rounded-full border-2 border-[#0B2538]/20 px-5 py-3 text-center font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
          >
            Baca Ulang Cerita
          </Link>

          <Link
            href="/katalog"
            className="rounded-full bg-[#0B2538] px-5 py-3 text-center font-bold text-white dark:bg-white dark:text-[#0B2538]"
          >
            Pilih Cerita Lain
          </Link>
        </div>
      </aside>
    </div>
  );
}