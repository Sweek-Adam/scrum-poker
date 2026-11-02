"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { PokerCard } from "./PokerCard";
import { Seat } from "./Seat";
import { DeckEditor } from "./DeckEditor";
import { Results, buildTally } from "./Results";
import { JoinForm } from "./JoinForm";
import { ConfigWarning } from "./ConfigWarning";
import { useRoom } from "@/lib/useRoom";
import { isConfigured } from "@/lib/supabase";
import { NAME_KEY } from "@/lib/storage";

export function RoomView({ code }: { code: string }) {
  const [name, setName] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NAME_KEY);
      if (stored) setName(stored);
    } catch {
      // Blocked storage: the pseudo gate below will ask for a name.
    }
    setCheckedStorage(true);
  }, []);

  if (!checkedStorage) return null;

  if (!name) {
    return (
      <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 py-10">
        <div className="glass w-full rounded-3xl p-7">
          <Logo className="mb-6" />
          <h1 className="font-display text-2xl font-semibold">Salle {code}</h1>
          <p className="mb-6 mt-1 text-sm text-white/45">Choisis un pseudo pour rejoindre la table.</p>
          {isConfigured ? null : (
            <div className="mb-6">
              <ConfigWarning />
            </div>
          )}
          <JoinForm initialCode={code} />
        </div>
      </main>
    );
  }

  return <Table code={code} name={name} onRename={setName} />;
}

function Table({
  code,
  name,
  onRename,
}: {
  code: string;
  name: string;
  onRename: (next: string) => void;
}) {
  const room = useRoom(code, name);
  const [editingDeck, setEditingDeck] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copied, setCopied] = useState(false);

  const tally = useMemo(() => buildTally(room.participants), [room.participants]);
  const topCount = tally[0]?.count ?? 0;
  const topValues = useMemo(
    () => new Set(tally.filter((entry) => entry.count === topCount && topCount > 1).map((entry) => entry.value)),
    [tally, topCount],
  );

  const voted = room.participants.filter((person) => person.vote !== null).length;
  const everyoneVoted = room.participants.length > 0 && voted === room.participants.length;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = setTimeout(() => setConfirmClear(false), 5000);
    return () => clearTimeout(timer);
  }, [confirmClear]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard denied: the code stays visible next to the button.
    }
  }

  function rename() {
    const next = window.prompt("Ton pseudo", name)?.trim();
    if (!next) return;
    const trimmed = next.slice(0, 24);
    try {
      localStorage.setItem(NAME_KEY, trimmed);
    } catch {
      // Not critical.
    }
    onRename(trimmed);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-6 pt-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="transition hover:opacity-80">
          <Logo />
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium
              ${
                room.status === "live"
                  ? "border-mint-400/30 bg-mint-400/10 text-mint-400"
                  : room.status === "error"
                    ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                    : "border-white/10 bg-white/5 text-white/50"
              }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {room.status === "live" ? "En direct" : room.status === "error" ? "Hors ligne" : "Connexion…"}
          </span>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3
              py-1.5 text-sm transition hover:border-white/25 hover:bg-white/10"
          >
            <span className="font-display tracking-[0.18em]">{code}</span>
            <span className="text-white/40">{copied ? "copié ✓" : "copier le lien"}</span>
          </button>

          <button
            type="button"
            onClick={rename}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60
              transition hover:border-white/25 hover:text-white"
          >
            {name}
          </button>
        </div>
      </header>

      {!isConfigured ? (
        <div className="mt-6">
          <ConfigWarning />
        </div>
      ) : null}

      {/* The table */}
      <section className="glass grain mt-6 flex-1 rounded-3xl p-5 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-lg font-semibold">
            Table
            <span className="ml-2 text-sm font-normal text-white/40">
              {room.participants.length} participant{room.participants.length > 1 ? "s" : ""} · {voted} vote
              {voted > 1 ? "s" : ""}
            </span>
          </h1>
          {everyoneVoted && !room.revealed ? (
            <span className="text-sm font-medium text-mint-400">Tout le monde a voté ✦</span>
          ) : null}
        </div>

        <ul className="mt-7 flex flex-wrap justify-center gap-5 sm:gap-7">
          <AnimatePresence mode="popLayout">
            {room.participants.map((person) => (
              <Seat
                key={person.id}
                participant={person}
                revealed={room.revealed}
                isMe={person.id === room.clientId}
                isTopValue={room.revealed && person.vote !== null && topValues.has(person.vote)}
              />
            ))}
          </AnimatePresence>
        </ul>

        {room.participants.length === 0 ? (
          <p className="mt-6 text-center text-sm text-white/35">
            {room.status === "live" ? "La salle est vide." : "Connexion à la salle…"}
          </p>
        ) : null}

        {room.revealed ? (
          <div className="mt-10 border-t border-white/8 pt-7">
            <Results participants={room.participants} tally={tally} />
          </div>
        ) : null}
      </section>

      {/* Controls */}
      <section className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={room.toggleReveal}
          className="rounded-xl bg-gradient-to-r from-accent-600 to-sky-cyan px-6 py-2.5 font-semibold
            text-ink-950 shadow-lg shadow-accent-600/25 transition hover:brightness-110 active:scale-[0.98]"
        >
          {room.revealed ? "Cacher les votes" : "Révéler les votes"}
        </button>
        <button
          type="button"
          onClick={room.resetVotes}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition
            hover:border-white/25 hover:bg-white/10 active:scale-[0.98]"
        >
          Nouveau tour
        </button>
        <button
          type="button"
          onClick={() => setEditingDeck(true)}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition
            hover:border-white/25 hover:bg-white/10 active:scale-[0.98]"
        >
          Deck ⚙
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirmClear) {
              setConfirmClear(true);
              return;
            }
            room.clearRoom();
            setConfirmClear(false);
          }}
          className={`rounded-xl border px-5 py-2.5 transition active:scale-[0.98] ${
            confirmClear
              ? "border-rose-400/60 bg-rose-500/20 text-rose-200"
              : "border-white/10 bg-white/5 text-white/55 hover:border-rose-400/40 hover:text-rose-200"
          }`}
        >
          {confirmClear ? "Confirmer — vider ?" : "Vider la salle"}
        </button>
      </section>

      {/* Deck */}
      <section className="mt-5">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-white/35">
          {room.myVote ? `Ton vote : ${room.myVote}` : "Choisis ta carte"}
        </p>
        <div className="flex gap-3 overflow-x-auto px-1 pb-4 pt-5 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {room.deck.map((value) => (
            <PokerCard
              key={value}
              value={value}
              selected={room.myVote === value}
              disabled={room.status !== "live"}
              onSelect={() => room.vote(value)}
            />
          ))}
        </div>
      </section>

      {editingDeck ? (
        <DeckEditor deck={room.deck} onApply={room.setDeck} onClose={() => setEditingDeck(false)} />
      ) : null}
    </main>
  );
}
