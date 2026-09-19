const PALETTES = [["#f59e0b", "#fde68a"], ["#2f3fb8", "#c7d0f8"], ["#3fa34d", "#c9ecd0"], ["#e11d74", "#fbcfe3"], ["#0ea5e9", "#bde6fb"], ["#7c3aed", "#ddd0fb"]];

export function ProductArt({ name, size = 120 }: { name: string; size?: number }) {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [dark, light] = PALETTES[h % PALETTES.length];
  const n = name.toLowerCase();
  const kind = /syrup|ml\b/.test(n) ? "syrup" : /cream|gel|tube/.test(n) ? "tube" : /drops|inhaler/.test(n) ? "drops" : /inject/.test(n) ? "vial" : "bottle";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={name} className="drop-shadow-md">
      {kind === "bottle" && <><rect x="34" y="18" width="52" height="16" rx="5" fill={dark} /><rect x="28" y="32" width="64" height="78" rx="14" fill="#fff" stroke={light} strokeWidth="3" /><rect x="28" y="56" width="64" height="32" fill={light} /><rect x="40" y="64" width="40" height="5" rx="2.5" fill={dark} /><rect x="40" y="74" width="26" height="4" rx="2" fill={dark} opacity=".5" /></>}
      {kind === "syrup" && <><rect x="48" y="10" width="24" height="16" rx="4" fill={dark} /><path d="M50 26h20v14l14 12v50a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V52l14-12z" fill="#fff" stroke={light} strokeWidth="3" /><rect x="36" y="64" width="48" height="30" fill={light} /><rect x="46" y="72" width="28" height="5" rx="2.5" fill={dark} /></>}
      {kind === "tube" && <><path d="M36 14h48l-6 14H42z" fill={dark} /><path d="M42 28h36l6 82H36z" fill="#fff" stroke={light} strokeWidth="3" /><rect x="40" y="56" width="40" height="26" fill={light} /><rect x="48" y="64" width="24" height="5" rx="2.5" fill={dark} /></>}
      {kind === "drops" && <><path d="M52 8h16v18H52z" fill={dark} /><rect x="40" y="24" width="40" height="86" rx="12" fill="#fff" stroke={light} strokeWidth="3" /><rect x="40" y="54" width="40" height="28" fill={light} /><circle cx="60" cy="68" r="6" fill={dark} /></>}
      {kind === "vial" && <><rect x="40" y="14" width="40" height="14" rx="4" fill={dark} /><rect x="44" y="28" width="32" height="82" rx="8" fill="#fff" stroke={light} strokeWidth="3" /><rect x="44" y="60" width="32" height="34" fill={light} /><rect x="50" y="70" width="20" height="5" rx="2.5" fill={dark} /></>}
    </svg>
  );
}
