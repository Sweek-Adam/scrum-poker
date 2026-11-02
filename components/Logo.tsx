export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3.5" y="6" width="15" height="21" rx="3.5" fill="#1d1d2b" stroke="#8b5cf6" strokeWidth="1.6"
          transform="rotate(-12 11 16.5)" />
        <rect x="13" y="5" width="15" height="21" rx="3.5" fill="#2a2a3c" stroke="#22d3ee" strokeWidth="1.6"
          transform="rotate(10 20.5 15.5)" />
        <text x="20" y="20" fill="#e9e9f2" fontSize="10" fontWeight="700" textAnchor="middle"
          transform="rotate(10 20.5 15.5)" fontFamily="system-ui">8</text>
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        Scrum<span className="text-accent-400">Poker</span>
      </span>
    </span>
  );
}
