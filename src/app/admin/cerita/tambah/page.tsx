import Container from "../../../../components/Container";
import AdminStoryForm from "../../../../components/AdminStoryForm";

export default function AddStoryPage() {
  return (
    <main className="bg-[#FFF8E7] py-20 dark:bg-[#071722]">
      <Container>
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#EF4F3A]">
          Admin
        </p>

        <h1 className="text-5xl font-extrabold text-[#0B2538] dark:text-white">
          Tambah Cerita
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#37576B] dark:text-white/70">
          Tambahkan cerita rakyat baru ke database Krida Bercerita.
        </p>

        <AdminStoryForm />
      </Container>
    </main>
  );
}