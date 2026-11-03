"use client";

import { useEffect, useState } from "react";
import { QrCode } from "./QrCode";

export function ShareDialog({ code, onClose }: { code: string; onClose: () => void }) {
  // Read on the client only; the dialog never renders during SSR because it is
  // mounted by a click, but a lazy initialiser keeps that from being a trap.
  const [url] = useState(() => (typeof window === "undefined" ? "" : window.location.href));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard denied: the URL is written out in full below anyway.
    }
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
        aria-label={`Rejoindre la salle ${code}`}
        onClick={(event) => event.stopPropagation()}
        className="glass w-full max-w-sm rounded-3xl p-6 text-center"
      >
        <div className="flex items-start justify-between gap-4 text-left">
          <div>
            <h2 className="font-display text-xl font-semibold">Rejoindre au téléphone</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Scanne ce code avec l&apos;appareil photo.
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

        {/* White card under the code: it is black on white in both themes. */}
        <div className="mt-6 inline-grid place-items-center rounded-2xl bg-white p-3 shadow-lg">
          <QrCode value={url} label={`Code QR pour rejoindre la salle ${code}`} />
        </div>

        {/* Not everyone can scan, and a screen reader cannot read a QR at all. */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">
          Ou entre ce code
        </p>
        <p className="font-display text-3xl font-bold tracking-[0.2em] text-fg">{code}</p>

        <p className="mt-4 break-all rounded-xl border border-line bg-sunken px-3 py-2 text-xs text-fg-muted">
          {url}
        </p>

        <button
          type="button"
          onClick={copyLink}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-grad-from to-grad-to px-5 py-2.5
            font-semibold text-on-accent transition hover:brightness-110 active:scale-[0.98]"
        >
          {copied ? "Lien copié ✓" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
