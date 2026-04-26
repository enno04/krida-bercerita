"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthNav from "./AuthNav";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Cerita",
    href: "/katalog",
  },
  {
    label: "Fitur",
    href: "/fitur",
  },
  {
    label: "Tentang",
    href: "/tentang",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#0B2538]/10 bg-[#FFF8E7]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#071722]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0">
            <Image
              src="/logo-krida-bercerita.png"
              alt="Logo Krida Bercerita"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="text-xl font-extrabold text-[#0B2538] dark:text-white">
            Krida Bercerita
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-[#0B2538] dark:text-white md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <AuthNav />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B2538] text-2xl font-bold text-white md:hidden"
          aria-label="Buka menu"
        >
          {isOpen ? "×" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#0B2538]/10 bg-[#FFF8E7] px-6 py-5 dark:border-white/10 dark:bg-[#071722] md:hidden">
          <nav className="grid gap-3 text-base font-bold text-[#0B2538] dark:text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#102C3D]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 dark:bg-[#102C3D]">
              <span className="font-bold text-[#0B2538] dark:text-white">
                Mode Tampilan
              </span>
              <ThemeToggle />
            </div>

            <div className="rounded-2xl bg-white p-4 dark:bg-[#102C3D]">
              <AuthNav onNavigate={closeMenu} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}