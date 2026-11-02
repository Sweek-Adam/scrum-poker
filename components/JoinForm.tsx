"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomCode, normalizeRoomCode } from "@/lib/room-code";
import { NAME_KEY } from "@/lib/storage";

export function JoinForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);

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
    router.push(`/room/${targetCode}`);
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const target = normalizeRoomCode(code);
        if (!target) {
          setError("Entre un code de salle, ou crée une nouvelle partie.");
          return;
        }
        go(target);
      }}
    >
      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Ton pseudo</span>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value.slice(0, 24));
            setError(null);
          }}
          placeholder="Alex"
          autoComplete="nickname"
          className="rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 text-base outline-none
            placeholder:text-white/25 focus:border-accent-500/70"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Code de salle</span>
        <input
          value={code}
          onChange={(event) => {
            setCode(normalizeRoomCode(event.target.value));
            setError(null);
          }}
          placeholder="ABC123"
          inputMode="text"
          className="rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 font-display text-lg
            tracking-[0.3em] uppercase outline-none placeholder:tracking-[0.3em] placeholder:text-white/25
            focus:border-accent-500/70"
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="mt-1 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium
            transition hover:border-white/25 hover:bg-white/10 active:scale-[0.98]"
        >
          Rejoindre
        </button>
        <button
          type="button"
          onClick={() => go(createRoomCode())}
          className="flex-1 rounded-xl bg-gradient-to-r from-accent-600 to-sky-cyan px-5 py-3 font-semibold
            text-ink-950 shadow-lg shadow-accent-600/25 transition hover:brightness-110 active:scale-[0.98]"
        >
          Créer une partie
        </button>
      </div>
    </form>
  );
}
