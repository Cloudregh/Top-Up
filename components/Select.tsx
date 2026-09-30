"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface Option { value: string; label: string; sub?: string; meta?: string; tag?: string }

/** Styled replacement for the native <select> (whose menu is drawn by the OS). Keyboard: ↑/↓, Enter, Esc. */
export function Select({ id, value, onChange, options, placeholder = "Select…", "aria-label": ariaLabel }:
  { id?: string; value: string; onChange: (v: string) => void; options: Option[]; placeholder?: string; "aria-label"?: string }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const sel = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", off); return () => document.removeEventListener("pointerdown", off);
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${listId}-${hi}`)?.scrollIntoView({ block: "nearest" }); }, [open, hi, listId]);

  const show = () => { setHi(Math.max(0, sel ? options.indexOf(sel) : 0)); setOpen(true); };
  const pick = (i: number) => { onChange(options[i].value); setOpen(false); };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return show();
      setHi((h) => (h + (e.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
    } else if ((e.key === "Enter" || e.key === " ") && open) { e.preventDefault(); pick(hi); }
    else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={root} className="relative">
      <button id={id} type="button" role="combobox" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${hi}` : undefined}
        onClick={() => (open ? setOpen(false) : show())} onKeyDown={key}
        className={`input flex items-center gap-3 text-left ${open ? "bg-white! outline-brand!" : ""}`}>
        <span className="min-w-0 flex-1">
          <span className={`block truncate ${sel ? "font-medium" : "text-muted"}`}>{sel?.label ?? placeholder}</span>
          {sel?.sub && <span className="block truncate text-xs text-muted">{sel.sub}</span>}
        </span>
        {sel?.meta && <span className="shrink-0 text-xs font-semibold text-muted">{sel.meta}</span>}
        <ChevronDown size={18} className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul id={listId} role="listbox" data-lenis-prevent
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5">
          {options.map((o, i) => (
            <li key={o.value} id={`${listId}-${i}`} role="option" aria-selected={o.value === value}
              onPointerEnter={() => setHi(i)} onClick={() => pick(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === hi ? "bg-mist" : ""}`}>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-medium">{o.label}{o.tag && <span className="rounded-full bg-[#dff1e4] px-2 py-0.5 text-[10px] font-bold text-leaf">{o.tag}</span>}</span>
                {o.sub && <span className="block truncate text-xs text-muted">{o.sub}</span>}
              </span>
              {o.meta && <span className="shrink-0 text-xs text-muted">{o.meta}</span>}
              <Check size={16} className={`shrink-0 text-brand ${o.value === value ? "" : "invisible"}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
