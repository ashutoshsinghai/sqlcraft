// Minimal inline SVG icons — 16x16, stroke-based, currentColor.
// Keeps bundle small and gives crisp icons at any DPR.

const base = "shrink-0";

export const IconSchema = (p: { class?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <rect x="2" y="3" width="12" height="3" rx="1" />
    <rect x="2" y="6.5" width="12" height="3" rx="1" />
    <rect x="2" y="10" width="12" height="3" rx="1" />
  </svg>
);

export const IconScripts = (p: { class?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M3 2.5h7l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" />
    <path d="M10 2.5v3h3" />
    <path d="M5 8.5h6M5 11h4" />
  </svg>
);

export const IconRun = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" class={`${base} ${p.class ?? ""}`}>
    <path d="M3 2l9 5-9 5z" />
  </svg>
);

export const IconSettings = (p: { class?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <circle cx="8" cy="8" r="2.2" />
    <path d="M8 1.5v1.6M8 12.9v1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M1.5 8h1.6M12.9 8h1.6M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
  </svg>
);

export const IconHint = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M7 1.5c-2.5 0-4 1.7-4 3.7 0 1.5 1 2.5 1.5 3.2.3.4.5.8.5 1.3v.3h4v-.3c0-.5.2-.9.5-1.3.5-.7 1.5-1.7 1.5-3.2 0-2-1.5-3.7-4-3.7z" />
    <path d="M5.5 11.5h3M6 13h2" />
  </svg>
);

export const IconCheck = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M2.5 7.5l3 3 6-6" />
  </svg>
);

export const IconClose = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M3 3l8 8M11 3l-8 8" />
  </svg>
);

export const IconArrowRight = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

export const IconWarn = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M7 2l5.5 9.5h-11z" />
    <path d="M7 6v2.5M7 10v.5" />
  </svg>
);

export const IconCross = (p: { class?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={`${base} ${p.class ?? ""}`}>
    <path d="M3 3l8 8M11 3l-8 8" />
  </svg>
);
