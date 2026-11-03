"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomCode, normalizeRoomCode } from "@/lib/room-code";
import { NAME_KEY } from "@/lib/storage";

export function JoinForm({
  initialCode = "",
  onJoined,
}: {
  initialCode?: string;
  /** Called instead of navigating when the visitor is already on this room's URL. */
  onJoined?: (pseudo: string) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);

  const typedCode = normalizeRoomCode(code);

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      // Private browsing or blocked storage: the field simply starts empty.
    }
  }, []);

  function go(targetCode: string) {
    const pseudo = name.trim();
    if (!pseudo) {
      setError("Il faut un pseudo pour s'asseoir à la table.");
      return;
    }
    try {
      localStorage.setItem(NAME_KEY, pseudo);
    } catch {
      // Not critical, the pseudo just will not be remembered next time.
    }
    // On the pseudo gate of /room/<code>, pushing that very URL navigates
    // nowhere, so the gate stayed up until the visitor reloaded. Hand the pseudo
    // to the parent instead and let it seat them straight away.
    if (onJoined && targetCode === initialCode) {
      onJoined(pseudo);
      return;
    }
    router.push(`/room/${targetCode}`);
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!typedCode) {
          setError("Entre un code de salle, ou crée une nouvelle partie.");
          return;
        }
        go(typedCode);
      }}
    >
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Ton pseudo</span>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value.slice(0, 24));
            setError(null);
          }}
          placeholder="Alex"
          autoComplete="nickname"
          aria-invalid={error !== null}
          className="rounded-xl border border-field bg-sunken px-4 py-3 text-base text-fg outline-none
            placeholder:text-fg-subtle focus:border-accent-strong"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Code de salle</span>
        <input
          value={code}
          onChange={(event) => {
            setCode(normalizeRoomCode(event.target.value));
            setError(null);
          }}
          placeholder="ABC123"
          inputMode="text"
          className="rounded-xl border border-field bg-sunken px-4 py-3 font-display text-lg
            tracking-[0.3em] uppercase text-fg outline-none placeholder:tracking-[0.3em]
            placeholder:text-fg-subtle focus:border-accent-strong"
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-1 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="flex-1 rounded-xl border border-line-strong bg-panel px-5 py-3 font-medium text-fg
            transition hover:border-accent-strong active:scale-[0.98]"
        >
          Rejoindre
        </button>
        {/* A room is only a Realtime channel, so creating one and joining it are
            the same act. Honour the code that was typed instead of discarding it
            and inventing another; only an empty field draws a fresh one. */}
        <button
          type="button"
          onClick={() => go(typedCode || createRoomCode())}
          className="flex-1 rounded-xl bg-gradient-to-r from-grad-from to-grad-to px-5 py-3 font-semibold
            text-on-accent shadow-lg transition hover:brightness-110 active:scale-[0.98]"
        >
          {typedCode ? `Créer la salle ${typedCode}` : "Créer une partie"}
        </button>
      </div>
    </form>
  );
}
