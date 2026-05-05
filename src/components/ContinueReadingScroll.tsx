"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type ContinueReadingScrollProps = {
  storyId: string;
};

export default function ContinueReadingScroll({
  storyId,
}: ContinueReadingScrollProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function continueReading() {
      const shouldContinue = searchParams.get("continue");

      if (shouldContinue !== "1") return;

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return;

      const { data } = await supabase
        .from("reading_progress")
        .select("scroll_position")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .maybeSingle();

      const scrollPosition = data?.scroll_position ?? 0;

      setTimeout(() => {
        if (scrollPosition > 0) {
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        } else {
          const contentElement = document.querySelector("#story-content");
          contentElement?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    }

    continueReading();
  }, [searchParams, storyId]);

  return null;
}