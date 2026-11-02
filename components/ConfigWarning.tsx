export function ConfigWarning() {
  return (
    <div className="rounded-xl border border-amber-glow/35 bg-amber-glow/10 px-4 py-3 text-sm text-amber-100">
      <strong className="font-semibold">Supabase n&apos;est pas configuré.</strong> Renseigne{" "}
      <code className="rounded bg-black/30 px-1.5 py-0.5 text-[0.8em]">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
      <code className="rounded bg-black/30 px-1.5 py-0.5 text-[0.8em]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
      (voir <code className="rounded bg-black/30 px-1.5 py-0.5 text-[0.8em]">.env.example</code>) pour activer
      le temps réel.
    </div>
  );
}
