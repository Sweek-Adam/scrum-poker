"use client";

import { motion } from "framer-motion";
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

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex w-[5.5rem] flex-col items-center gap-2"
    >
      <div className="[perspective:900px]">
        <div
          className="flip relative h-[6.5rem] w-[4.5rem]"
          style={{ transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Back: pending or ready, hidden value */}
          <div
            className={`flip-face absolute inset-0 grid place-items-center rounded-xl border
              ${
                hasVoted
                  ? "border-mint-400/50 bg-gradient-to-br from-ink-700 to-ink-800 shadow-lg shadow-mint-400/10"
                  : "border-dashed border-white/12 bg-ink-900/60"
              }`}
          >
            {hasVoted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6.5" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            ) : (
              <motion.span
                animate={{ opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-lg text-white/50"
              >
                •••
              </motion.span>
            )}
          </div>

          {/* Front: the revealed value */}
          <div
            className={`flip-face absolute inset-0 grid place-items-center rounded-xl border font-display
              text-2xl font-bold [transform:rotateY(180deg)]
              ${
                isTopValue
                  ? "border-mint-400/70 bg-gradient-to-br from-mint-400/25 to-sky-cyan/10 text-mint-400"
                  : "border-white/12 bg-ink-700 text-white"
              }`}
          >
            {participant.vote}
          </div>
        </div>
      </div>

      <p
        className={`max-w-full truncate text-center text-sm font-medium ${
          isMe ? "text-accent-300" : "text-white/65"
        }`}
        title={participant.name}
      >
        {participant.name}
        {isMe ? <span className="text-white/30"> (toi)</span> : null}
      </p>
    </motion.li>
  );
}
