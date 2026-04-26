import Image from "next/image";
import Link from "next/link";

type StoryCardProps = {
  story: {
    slug: string;
    title: string;
    province: string;
    region: string;
    summary: string;
    image?: string;
    image_url?: string;
  };
};

export default function StoryCard({ story }: StoryCardProps) {
  const imageSrc = story.image || story.image_url || "/cerita.png";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(11,37,56,0.13)] transition hover:-translate-y-1 dark:bg-[#102C3D]">
      <div className="relative h-48 overflow-hidden md:h-56">
        <Image
          src={imageSrc}
          alt={story.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538]/70 via-[#0B2538]/20 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#0E5A78]">
          AI Visual
        </span>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white md:text-2xl">
            {story.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <span className="mb-3 inline-flex w-fit rounded-full bg-[#F6B23C]/20 px-3 py-1 text-xs font-extrabold text-[#8A5A00]">
          {story.province}
        </span>

        <p className="line-clamp-4 min-h-[88px] text-sm leading-6 text-[#37576B] dark:text-white/70 md:min-h-[96px]">
          {story.summary}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/cerita/${story.slug}`}
            className="font-extrabold text-[#EF4F3A]"
          >
            Baca cerita →
          </Link>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
            Quiz tersedia
          </span>
        </div>
      </div>
    </article>
  );
}