"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { supabase } from "../../lib/supabaseClient";

type Profile = {
  role: "user" | "admin";
};

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setIsChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single<Profile>();

      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }

    checkSession();
  }, [router]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8E7] px-6 py-16 dark:bg-[#071722]">
        <p className="font-bold text-[#0B2538] dark:text-white">
          Memeriksa sesi login...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8E7] px-6 py-16 dark:bg-[#071722]">
      <LoginForm />
    </main>
  );
}