"use client";

import { motion } from "framer-motion";

export function PokerCard({
  value,
  selected,
  disabled,
  onSelect,
}: {
  value: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Voter ${value}`}
      whileHover={disabled ? undefined : { y: -14, rotate: 0 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      animate={{ y: selected ? -18 : 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`relative grid h-24 w-[4.25rem] shrink-0 place-items-center rounded-2xl border text-2xl
        font-semibold tabular-nums transition-colors sm:h-28 sm:w-20 sm:text-3xl
        ${
          selected
            ? "border-accent-400 bg-gradient-to-br from-accent-600 to-accent-500 text-white shadow-xl shadow-accent-600/40"
            : "border-white/10 bg-ink-800/80 text-white/80 hover:border-accent-400/60 hover:text-white"
        }
        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <span className="absolute left-2 top-1.5 text-[0.6rem] font-medium opacity-45">{value}</span>
      <span className="font-display">{value}</span>
      <span className="absolute bottom-1.5 right-2 rotate-180 text-[0.6rem] font-medium opacity-45">{value}</span>
    </motion.button>
  );
}
