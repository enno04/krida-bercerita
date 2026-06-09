# Krida Bercerita

Krida Bercerita adalah website cerita rakyat Indonesia yang dibuat sebagai media pembelajaran dan hiburan ringan. Website ini menyediakan kumpulan cerita rakyat dari berbagai daerah di Indonesia dengan tampilan yang menarik, mudah digunakan, dan dapat diakses melalui perangkat desktop maupun mobile.

Website ini mendukung fitur membaca cerita, mencari cerita, memfilter cerita berdasarkan provinsi, mengerjakan quiz edukasi, login dan register, dashboard user, bookmark cerita, progress membaca otomatis, nilai terbaik quiz, serta dashboard admin untuk mengelola cerita dan quiz.

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Jenis Pengguna](#jenis-pengguna)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Cara Menjalankan Project](#cara-menjalankan-project)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Build Project](#build-project)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Catatan Penting](#catatan-penting)
- [Pengembang](#pengembang)

## Tentang Project

Krida Bercerita dikembangkan untuk membantu pengguna mengenal cerita rakyat Indonesia secara digital. Melalui website ini, pengguna dapat membaca cerita dari berbagai provinsi, memahami pesan moral dari setiap cerita, dan mengerjakan quiz untuk menguji pemahaman setelah membaca.

Project ini juga menyediakan fitur untuk user yang sudah login, seperti menyimpan bookmark, melanjutkan progress membaca, dan melihat nilai terbaik quiz. Selain itu, admin dapat mengelola konten cerita dan quiz melalui dashboard admin tanpa harus mengubah kode program secara langsung.

## Fitur Utama

### Fitur untuk Guest / Pengunjung

- Melihat halaman beranda.
- Membuka katalog cerita.
- Mencari cerita berdasarkan judul, provinsi, wilayah, atau ringkasan.
- Memfilter cerita berdasarkan provinsi.
- Membaca detail cerita.
- Mengerjakan quiz tanpa login.
- Melihat halaman fitur dan tentang.

### Fitur untuk User

- Register akun.
- Login akun.
- Membaca cerita sebagai user.
- Menyimpan bookmark cerita.
- Menyimpan progress membaca otomatis.
- Melanjutkan membaca dari posisi terakhir.
- Melihat dashboard user.
- Melihat nilai terbaik quiz.
- Menghapus history membaca.
- Menghapus nilai quiz.
- Menghapus bookmark.
- Logout.

### Fitur untuk Admin

- Login sebagai admin.
- Membuka dashboard admin.
- Menambah cerita.
- Mengedit cerita.
- Menghapus cerita.
- Upload gambar cerita.
- Mengelola quiz cerita.
- Menampilkan cerita pilihan di homepage.
- Search dan filter cerita di dashboard admin.
- Logout.

## Jenis Pengguna

| Pengguna | Hak Akses |
| --- | --- |
| Guest | Membaca cerita, mencari cerita, memfilter cerita, melihat detail cerita, dan mengerjakan quiz tanpa menyimpan data. |
| User | Menggunakan fitur bookmark, progress membaca otomatis, nilai terbaik quiz, dan dashboard user. |
| Admin | Mengelola cerita, gambar cerita, quiz, dan cerita pilihan yang tampil di homepage. |

## Teknologi yang Digunakan

Project ini dibuat menggunakan beberapa teknologi berikut:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Auth
- Supabase Storage
- GitHub
- Vercel

## Struktur Folder

Berikut gambaran struktur folder utama pada project:

```bash
krida-bercerita/
├── public/
│   ├── logo-krida-bercerita.png
│   ├── cerita.png
│   └── gambar lainnya
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── katalog/
│   │   ├── cerita/[slug]/
│   │   ├── quiz/[slug]/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── fitur/
│   │   └── tentang/
│   ├── components/
│   ├── data/
│   └── lib/
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project di komputer lokal.

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-repository.git
```

Ganti `username/nama-repository` sesuai dengan repository GitHub yang digunakan.

### 2. Masuk ke Folder Project

```bash
cd krida-bercerita
```

### 3. Install Dependency

```bash
npm install
```

### 4. Buat File Environment

Buat file `.env.local` di folder utama project, lalu isi dengan konfigurasi Supabase.

```env
NEXT_PUBLIC_SUPABASE_URL=isi_dengan_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_dengan_anon_key_supabase
```

### 5. Jalankan Project

```bash
npm run dev
```

Setelah berhasil, buka browser dan akses:

```bash
http://localhost:3000
```

## Konfigurasi Environment

Project ini membutuhkan environment variable dari Supabase.

| Nama Variable | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key dari Supabase. |

Pastikan variable tersebut juga sudah dimasukkan di Vercel melalui menu:

```text
Vercel Dashboard > Project > Settings > Environment Variables
```

## Build Project

Untuk mengecek apakah project siap di-deploy, jalankan perintah berikut:

```bash
npm run build
```

Jika tidak ada error, project sudah siap untuk di-deploy.

## Deploy ke Vercel

Project ini dapat di-deploy menggunakan Vercel dengan alur berikut:

1. Push project ke GitHub.
2. Hubungkan repository GitHub ke Vercel.
3. Tambahkan environment variable Supabase di Vercel.
4. Jalankan deploy.
5. Setiap ada perubahan kode dan dilakukan `git push`, Vercel akan melakukan deploy ulang secara otomatis.

Contoh perintah untuk update kode ke GitHub:

```bash
git add .
git commit -m "Update website Krida Bercerita"
git push origin main
```

## Catatan Penting

- Jangan upload isi `.env.local` ke repository publik.
- Pastikan environment variable Supabase sudah terisi di Vercel.
- Pastikan bucket Supabase Storage bernama `story-images` sudah tersedia.
- Gambar cerita disimpan menggunakan Supabase Storage.
- Data cerita, quiz, bookmark, progress membaca, dan hasil quiz disimpan menggunakan Supabase Database.
- Admin hanya dapat mengakses dashboard admin jika akun memiliki role admin.

## Pengembang

Project ini dibuat oleh Kelompok 14:

- Enno Penas Saputra K. - 202310370311330
- Arkan Alsafi Sulaksono - 202210370311130
- Muhamad Arga Kurniawan - 202310370311331

Program Studi Informatika  
Universitas Muhammadiyah Malang  
2026
