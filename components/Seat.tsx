"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Participant } from "@/lib/useRoom";

export function Seat({
  participant,
  revealed,
  isMe,
  isTopValue,
}: {
  participant: Participant;
  revealed: boolean;
  isMe: boolean;
  isTopValue: boolean;
}) {
  const hasVoted = participant.vote !== null;
  const showFace = revealed && hasVoted;
  const reduceMotion = useReducedMotion();

  const spokenState = showFace
    ? `a voté ${participant.vote}${isTopValue ? ", valeur majoritaire" : ""}`
    : hasVoted
      ? "a voté"
      : "n'a pas encore voté";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex w-[5.5rem] flex-col items-center gap-2"
    >
      {/* The flip is decoration; the state is announced by the sr-only line below. */}
      <div className="[perspective:900px]" aria-hidden="true">
        <div
          className="flip relative h-[6.5rem] w-[4.5rem]"
          style={{ transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Back: pending or ready, hidden value */}
          <div
            className={`flip-face absolute inset-0 grid place-items-center rounded-xl border-2
              ${
                hasVoted
                  ? "border-success bg-success-soft"
                  : "border-dashed border-field bg-sunken"
              }`}
          >
            {hasVoted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" className="text-success" strokeWidth="2.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <motion.span
                animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-lg text-fg-muted"
              >
                •••
              </motion.span>
            )}
          </div>

          {/* Front: the revealed value */}
          <div
            className={`flip-face absolute inset-0 grid place-items-center rounded-xl border-2 font-display
              text-2xl font-bold [transform:rotateY(180deg)]
              ${
                isTopValue
                  ? "border-success bg-success-soft text-fg"
                  : "border-field bg-raised text-fg"
              }`}
          >
            {participant.vote}
            {/* Majority is not conveyed by colour alone. */}
            {isTopValue ? (
              <span className="absolute -top-2.5 rounded-full bg-success px-1.5 text-[0.6rem]
                font-bold uppercase tracking-wide text-surface">
                majorité
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p
        className={`max-w-full truncate text-center text-sm font-medium ${
          isMe ? "text-accent" : "text-fg-muted"
        }`}
        title={participant.name}
      >
        {participant.name}
        {isMe ? <span className="text-fg-subtle"> (toi)</span> : null}
        <span className="sr-only"> — {spokenState}</span>
      </p>
    </motion.li>
  );
}
