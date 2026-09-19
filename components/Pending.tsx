/**
 * Marks UI that is fed by placeholder content because the API doesn't provide it yet.
 * Invisible to customers. Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=1 to outline every such
 * region with the endpoint/field it is waiting for (see docs/API-GAPS.md).
 */
const ON = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1";

export function Pending({ waitingFor, children, className = "" }: { waitingFor: string; children: React.ReactNode; className?: string }) {
  if (!ON) return <>{children}</>;
  return (
    <div className={`relative rounded-[28px] outline-2 outline-dashed outline-offset-4 outline-amber-400 ${className}`} data-awaiting-api={waitingFor}>
      <span className="pointer-events-none absolute -top-3 left-4 z-30 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-ink shadow">Awaiting API · {waitingFor}</span>
      {children}
    </div>
  );
}
