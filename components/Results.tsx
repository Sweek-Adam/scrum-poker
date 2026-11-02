"use client";

import { motion } from "framer-motion";
import { COFFEE, UNSURE, numericValue } from "@/lib/deck";
import type { Participant } from "@/lib/useRoom";

export type Tally = { value: string; count: number }[];

export function buildTally(participants: Participant[]): Tally {
  const counts = new Map<string, number>();
  for (const person of participants) {
    if (person.vote === null) continue;
    counts.set(person.vote, (counts.get(person.vote) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export function Results({ participants, tally }: { participants: Participant[]; tally: Tally }) {
  const cast = participants.filter((person) => person.vote !== null);
  // "?" and the coffee cup are abstentions, not estimates: they stay out of every statistic.
  const estimates = cast
    .map((person) => person.vote as string)
    .filter((vote) => vote !== UNSURE && vote !== COFFEE);
  const numbers = estimates
    .map((vote) => numericValue(vote))
    .filter((value): value is number => value !== null);

  const average =
    numbers.length > 0 ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
  const distinctEstimates = new Set(estimates).size;
  const unanimous = estimates.length > 1 && distinctEstimates === 1;
  const abstentions = cast.length - estimates.length;
  const spread = numbers.length > 1 ? Math.max(...numbers) - Math.min(...numbers) : null;
  const maxCount = tally[0]?.count ?? 1;

  if (cast.length === 0) {
    return <p className="text-center text-sm text-white/40">Personne n&apos;a voté.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {unanimous ? (
        <p className="rounded-xl border border-mint-400/35 bg-mint-400/10 px-4 py-2.5 text-center text-sm
          font-medium text-mint-400">
          🎉 Unanimité sur {estimates[0]} — on passe au ticket suivant.
        </p>
      ) : null}

      <div className="flex flex-wrap items-end justify-center gap-3">
        {tally.map((entry) => (
          <div key={entry.value} className="flex w-14 flex-col items-center gap-1.5">
            <span className="text-xs font-medium tabular-nums text-white/45">{entry.count}</span>
            <motion.div
              initial={{ height: 4 }}
              animate={{ height: `${Math.max(12, (entry.count / maxCount) * 72)}px` }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="w-full rounded-t-md bg-gradient-to-t from-accent-600/50 to-accent-400"
            />
            <span className="grid h-9 w-full place-items-center rounded-lg border border-white/12 bg-ink-800
              font-display text-sm font-semibold">
              {entry.value}
            </span>
          </div>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Moyenne" value={average === null ? "—" : formatNumber(average)} />
        <Stat label="Votes" value={`${cast.length}/${participants.length}`} />
        <Stat
          label="Estimations distinctes"
          value={distinctEstimates === 0 ? "—" : String(distinctEstimates)}
          hint={abstentions > 0 ? `${abstentions} abstention${abstentions > 1 ? "s" : ""}` : undefined}
        />
        <Stat label="Écart" value={spread === null ? "—" : formatNumber(spread)} />
      </dl>
    </motion.div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-ink-900/50 px-3 py-2.5 text-center">
      <dt className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/35">{label}</dt>
      <dd className="mt-0.5 font-display text-xl font-semibold tabular-nums">{value}</dd>
      {hint ? <p className="text-[0.68rem] text-white/30">{hint}</p> : null}
    </div>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
