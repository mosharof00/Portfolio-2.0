import type { CapIconName } from "../../data/site";

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 12 L12 4 M7 4 H12 V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 3v7M5.5 7.5 8 10l2.5-2.5M3.5 13h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CapIcon({ name }: { name: CapIconName }) {
  const paths: Record<CapIconName, string> = {
    device:
      "M6 3.5h4A1.5 1.5 0 0 1 11.5 5v8A1.5 1.5 0 0 1 10 14.5H6A1.5 1.5 0 0 1 4.5 13V5A1.5 1.5 0 0 1 6 3.5Zm0 10h4M8 12.4h.01",
    widget: "M4 4.5h4v4H4zM10 4.5h4v4h-4zM4 10.5h4v4H4zM10 10.5h4v4h-4z",
    layers: "M3 7.5 9 4l6 3.5L9 11 3 7.5Zm0 3.5 6 3.5 6-3.5",
    signal: "M3 12.5h2v-2H3zm4 0h2v-5H7zm4 0h2v-8h-2z",
    shield: "M9 3.5 4.5 5.2v4.1c0 3 2 4.7 4.5 5.7 2.5-1 4.5-2.7 4.5-5.7V5.2L9 3.5Z",
    stack:
      "M3.5 6.5 9 4l5.5 2.5L9 9 3.5 6.5Zm0 3L9 12l5.5-2.5M3.5 9.5 9 12l5.5-2.5",
  };

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
