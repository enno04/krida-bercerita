"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type Profile = {
  role: "user" | "admin";
};

export default function AuthNav() {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  useEffect(() => {
    async function getSessionAndRole() {
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData.session?.user;

      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single<Profile>();

      setRole(profile?.role ?? "user");
      setIsLoading(false);
    }

    getSessionAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSessionAndRole();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setRole(null);
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="h-11 w-24 animate-pulse rounded-full bg-[#0B2538]/10 dark:bg-white/10" />
    );
  }

  if (!role) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#0B2538] px-6 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#0B2538]"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={role === "admin" ? "/admin" : "/dashboard"}
        className="rounded-full bg-[#EF4F3A] px-6 py-3 text-sm font-bold text-white"
      >
        {role === "admin" ? "Admin" : "Dashboard"}
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border-2 border-[#0B2538]/20 px-6 py-3 text-sm font-bold text-[#0B2538] dark:border-white/20 dark:text-white"
      >
        Logout
      </button>
    </div>
  );
}