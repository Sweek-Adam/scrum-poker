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
      className={`relative grid h-24 w-[4.25rem] shrink-0 place-items-center rounded-2xl border-2 text-2xl
        font-semibold tabular-nums transition-colors sm:h-28 sm:w-20 sm:text-3xl
        ${
          selected
            ? "border-accent-strong bg-gradient-to-br from-grad-from to-grad-to text-on-accent shadow-lg"
            : "border-field bg-raised text-fg hover:border-accent-strong"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      {/* Corner pips repeat the centre value; hidden so it is not announced three times. */}
      <span aria-hidden="true" className="absolute left-2 top-1.5 text-[0.65rem] font-semibold">
        {value}
      </span>
      <span className="font-display">{value}</span>
      <span aria-hidden="true" className="absolute bottom-1.5 right-2 rotate-180 text-[0.65rem] font-semibold">
        {value}
      </span>
      {/* A chosen card is not signalled by colour alone. */}
      {selected ? (
        <span className="absolute -top-2 right-1.5 grid size-5 place-items-center rounded-full
          bg-on-accent text-[0.7rem] font-bold text-grad-from shadow">
          ✓
        </span>
      ) : null}
    </motion.button>
  );
}
