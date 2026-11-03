"use client";

import qrcode from "qrcode-generator";

/**
 * Renders a QR code as inline SVG.
 *
 * The colours are deliberately NOT themed. A QR needs maximum contrast and the
 * dark modules must be the dark ones: plenty of phone scanners refuse an
 * inverted code. So it stays black on white in both themes, and the caller is
 * expected to put it on a white card.
 */
export function QrCode({
  value,
  label,
  size = 232,
}: {
  value: string;
  label: string;
  size?: number;
}) {
  // Type 0 picks the smallest version that fits; M corrects ~15% of damage,
  // which is the usual trade-off for a code read off a screen.
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();

  const count = qr.getModuleCount();
  // The spec asks for four empty modules around the code, or scanners may not
  // find its edges against the surrounding page.
  const quiet = 4;
  const span = count + quiet * 2;

  // One path for every dark module rather than one <rect> each: same drawing,
  // a fraction of the DOM nodes.
  let path = "";
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) path += `M${col + quiet} ${row + quiet}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className="rounded-lg"
    >
      <rect width={span} height={span} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
