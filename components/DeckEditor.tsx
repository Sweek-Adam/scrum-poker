"use client";

import { useEffect, useState } from "react";
import { COFFEE, DECK_PRESETS, UNSURE, parseDeckInput } from "@/lib/deck";

export function DeckEditor({
  deck,
  onApply,
  onClose,
}: {
  deck: string[];
  onApply: (values: string[]) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState(deck.join(", "));
  const preview = parseDeckInput(raw);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function ensureSpecials() {
    const next = [...preview];
    if (!next.includes(UNSURE)) next.push(UNSURE);
    if (!next.includes(COFFEE)) next.push(COFFEE);
    setRaw(next.join(", "));
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paramétrer le deck"
        onClick={(event) => event.stopPropagation()}
        className="glass max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 shadow-2xl shadow-black/60"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Valeurs des cartes</h2>
            <p className="mt-1 text-sm text-white/45">
              Le changement s&apos;applique à toute la salle et réinitialise les votes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg px-2 py-1 text-xl leading-none text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Presets</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DECK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setRaw(preset.values.join(", "))}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition
                  hover:border-accent-400/60 hover:bg-accent-500/15"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
            Valeurs (séparées par des virgules, 24 max)
          </span>
          <textarea
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            rows={3}
            className="resize-none rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 outline-none
              focus:border-accent-500/70"
          />
        </label>

        <button
          type="button"
          onClick={ensureSpecials}
          className="mt-3 text-sm text-accent-300 underline-offset-4 transition hover:underline"
        >
          Ajouter « {UNSURE} » et « {COFFEE} »
        </button>

        <div className="mt-6">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
            Aperçu · {preview.length} carte{preview.length > 1 ? "s" : ""}
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {preview.length === 0 ? (
              <p className="text-sm text-rose-300">Il faut au moins une valeur.</p>
            ) : (
              preview.map((value) => (
                <span
                  key={value}
                  className="grid h-11 min-w-8 place-items-center rounded-lg border border-white/12
                    bg-ink-800 px-2 font-display text-sm font-semibold"
                >
                  {value}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition hover:bg-white/10"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={preview.length === 0}
            onClick={() => {
              onApply(preview);
              onClose();
            }}
            className="rounded-xl bg-gradient-to-r from-accent-600 to-sky-cyan px-5 py-2.5 font-semibold
              text-ink-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
