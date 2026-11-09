// Vector artwork, never a Unicode glyph: identical geometry on iOS and desktop.
export default function BrandSpark({ className = '', size = '1em' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 2v10m0 8v10M2 16h10m8 0h10M6.1 6.1l7.1 7.1m5.6 5.6 7.1 7.1M6.1 25.9l7.1-7.1m5.6-5.6 7.1-7.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}
