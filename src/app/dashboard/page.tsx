"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/Container";
import UserDashboardContent from "../../components/UserDashboardContent";
import { supabase } from "../../lib/supabaseClient";

type Profile = {
  full_name: string | null;
  role: "user" | "admin";
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single<Profile>();

      if (!profileData) {
        router.push("/login");
        return;
      }

      if (profileData.role === "admin") {
        router.push("/admin");
        return;
      }

      setProfile(profileData);
      setIsLoading(false);
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8E7] dark:bg-[#071722]">
        <p className="font-bold text-[#0B2538] dark:text-white">
          Memuat dashboard...
        </p>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
          Dashboard User
        </p>

        <h1 className="text-5xl font-extrabold text-[#0B2538] dark:text-white">
          Halo, {profile.full_name || "Pembaca"} 👋
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
          Di halaman ini kamu bisa melihat bookmark cerita dan progress membaca
          yang sudah kamu simpan.
        </p>

        <UserDashboardContent profile={profile} />
      </Container>
    </main>
  );
}