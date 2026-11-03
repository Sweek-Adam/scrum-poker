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
      className="fixed inset-0 z-50 grid place-items-center bg-surface/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paramétrer le deck"
        onClick={(event) => event.stopPropagation()}
        className="glass max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Valeurs des cartes</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Le changement s&apos;applique à toute la salle et réinitialise les votes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg px-2 py-1 text-xl leading-none text-fg-muted transition hover:text-fg"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Presets</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DECK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setRaw(preset.values.join(", "))}
                className="rounded-full border border-line-strong bg-panel px-3 py-1.5 text-sm text-fg
                  transition hover:border-accent-strong hover:bg-accent-soft"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">
            Valeurs (séparées par des virgules, 24 max)
          </span>
          <textarea
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            rows={3}
            className="resize-none rounded-xl border border-field bg-sunken px-4 py-3 text-fg outline-none
              focus:border-accent-strong"
          />
        </label>

        <button
          type="button"
          onClick={ensureSpecials}
          className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
        >
          Ajouter « {UNSURE} » et « {COFFEE} »
        </button>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">
            Aperçu · {preview.length} carte{preview.length > 1 ? "s" : ""}
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {preview.length === 0 ? (
              <p className="text-sm font-medium text-danger">Il faut au moins une valeur.</p>
            ) : (
              preview.map((value) => (
                <span
                  key={value}
                  className="grid h-11 min-w-8 place-items-center rounded-lg border border-field
                    bg-raised px-2 font-display text-sm font-semibold text-fg"
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
            className="rounded-xl border border-line-strong bg-panel px-5 py-2.5 text-fg transition
              hover:border-accent-strong"
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
            className="rounded-xl bg-gradient-to-r from-grad-from to-grad-to px-5 py-2.5 font-semibold
              text-on-accent transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
