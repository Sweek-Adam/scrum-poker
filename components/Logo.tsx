export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Fills follow the theme so the mark does not sit in a dark hole on a light page. */}
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3.5" y="6" width="15" height="21" rx="3.5" fill="var(--raised)"
          stroke="var(--accent-strong)" strokeWidth="1.6" transform="rotate(-12 11 16.5)" />
        <rect x="13" y="5" width="15" height="21" rx="3.5" fill="var(--sunken)" stroke="#0891b2"
          strokeWidth="1.6" transform="rotate(10 20.5 15.5)" />
        <text x="20" y="20" fill="var(--fg)" fontSize="10" fontWeight="700" textAnchor="middle"
          transform="rotate(10 20.5 15.5)" fontFamily="system-ui">8</text>
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-fg">
        Scrum<span className="text-accent">Poker</span>
      </span>
    </span>
  );
}
