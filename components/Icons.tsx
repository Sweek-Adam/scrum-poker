type IconProps = { className?: string };

const base = "size-5";

export function BoltIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" stroke="currentColor" strokeWidth="1.7"
        strokeLinejoin="round" />
    </svg>
  );
}

export function CardsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="5" width="10" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.7"
        transform="rotate(-10 7.5 12)" />
      <rect x="11.5" y="5" width="10" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.7"
        transform="rotate(10 16.5 12)" />
    </svg>
  );
}

export function KeyIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12.2 12H21M18 12v3.2M15.2 12v2.2" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" />
    </svg>
  );
}

export function QrIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20.5h1.5M20.5 14h.5" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
