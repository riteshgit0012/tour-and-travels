// A small diya-flame divider — the recurring signature motif.
export default function FlameDivider() {
  return (
    <div className="flame-divider" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 2c2.2 3 4 5 4 8a4 4 0 0 1-8 0c0-1.6.8-3 2-4.5C11 7 12 5 12 2z" />
      </svg>
    </div>
  );
}
