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
        // A room is only a Realtime channel, so joining one and creating it are
        // the same act — hence a single button. Two buttons invited the reading
        // that "create" needed its own code, and it used to draw one even when
        // the field was filled. An empty field is the only case that draws one.
        go(typedCode || createRoomCode());
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
          aria-describedby="code-hint"
          className="rounded-xl border border-field bg-sunken px-4 py-3 font-display text-lg
            tracking-[0.3em] uppercase text-fg outline-none placeholder:tracking-[0.3em]
            placeholder:text-fg-subtle focus:border-accent-strong"
        />
        <p id="code-hint" className="text-xs text-fg-subtle">
          Laisse vide pour ouvrir une nouvelle salle avec un code au hasard.
        </p>
      </label>

      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-1 rounded-xl bg-gradient-to-r from-grad-from to-grad-to px-5 py-3 font-semibold
          text-on-accent shadow-lg transition hover:brightness-110 active:scale-[0.98]"
      >
        Rejoindre la salle
      </button>
    </form>
  );
}
