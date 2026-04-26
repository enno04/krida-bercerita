import { supabase } from "../../lib/supabaseClient";

export default async function TestSupabasePage() {
  const { data, error } = await supabase.from("stories").select("*").limit(1);

  return (
    <main className="min-h-screen bg-[#FFF8E7] p-10 text-[#0B2538]">
      <h1 className="text-4xl font-extrabold">Test Supabase</h1>

      {error ? (
        <pre className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">
          {error.message}
        </pre>
      ) : (
        <pre className="mt-6 rounded-xl bg-white p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}