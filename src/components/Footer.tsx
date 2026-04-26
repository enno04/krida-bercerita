import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-[#0B2538] py-10 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-krida-bercerita.png"
                alt="Logo Krida Bercerita"
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="font-extrabold">Krida Bercerita</span>
            </div>

            <p className="mt-3 max-w-md text-sm text-white/65">
              Website cerita rakyat Indonesia untuk membaca, belajar, dan
              mengenal budaya Nusantara.
            </p>

            <p className="mt-3 text-xs text-white/50">
              © 2026 Krida Bercerita. Semua hak dilindungi.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-white/75">
            <Link href="/">Beranda</Link>
            <Link href="/katalog">Cerita</Link>
            <Link href="/fitur">Fitur</Link>
            <Link href="/tentang">Tentang</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}