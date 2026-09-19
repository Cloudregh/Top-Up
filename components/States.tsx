import { AlertTriangle, Inbox } from "lucide-react";

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-mist"><Inbox className="text-brand" /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", detail, onRetry }: { title?: string; detail?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-rose-50"><AlertTriangle className="text-rose-500" /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {detail && <p className="max-w-sm text-sm text-muted">{detail}</p>}
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export const Skeleton = ({ className = "h-40" }: { className?: string }) => <div className={`skeleton ${className}`} aria-hidden />;
