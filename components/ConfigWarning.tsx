export function ConfigWarning() {
  return (
    <div className="rounded-xl border border-notice bg-notice-soft px-4 py-3 text-sm text-fg">
      <strong className="font-semibold text-notice">Supabase n&apos;est pas configuré.</strong> Renseigne{" "}
      <code className="rounded bg-sunken px-1.5 py-0.5 text-[0.8em]">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
      <code className="rounded bg-sunken px-1.5 py-0.5 text-[0.8em]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
      (voir <code className="rounded bg-sunken px-1.5 py-0.5 text-[0.8em]">.env.example</code>) pour activer
      le temps réel.
    </div>
  );
}
