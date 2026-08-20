/* Async render helper: every console/demo list and stat block goes through
 * this so loading, error-with-retry, and empty states exist everywhere
 * (ARCHITECTURE §3 acceptance criterion). */

export function LoadingBlock({
  height = 120,
  lines = 3,
}: {
  height?: number | undefined;
  lines?: number | undefined;
}) {
  const lineH = Math.max(12, Math.floor((height - (lines - 1) * 10) / lines));
  return (
    <div aria-busy="true" aria-label="Loading" style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: lineH, width: i === lines - 1 ? "62%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="data-state" role="alert">
      <span className="data-state-title" style={{ color: "var(--bad)" }}>
        COULDN&apos;T LOAD
      </span>
      <span>{message}</span>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyBlock({ title, hint }: { title: string; hint?: string | undefined }) {
  return (
    <div className="data-state">
      <span className="data-state-title">{title}</span>
      {hint && <span>{hint}</span>}
    </div>
  );
}

interface QueryLike<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function DataState<T>({
  query,
  isEmpty,
  emptyTitle,
  emptyHint,
  loadingHeight,
  loadingLines,
  children,
}: {
  query: QueryLike<T>;
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyHint?: string;
  loadingHeight?: number;
  loadingLines?: number;
  children: (data: T) => React.ReactNode;
}) {
  if (query.isPending) return <LoadingBlock height={loadingHeight} lines={loadingLines} />;
  if (query.isError || query.data === undefined) {
    const message =
      query.error instanceof Error ? query.error.message : "Something went wrong on our side.";
    return <ErrorBlock message={message} onRetry={query.refetch} />;
  }
  if (isEmpty?.(query.data)) {
    return <EmptyBlock title={emptyTitle ?? "NOTHING HERE YET"} hint={emptyHint} />;
  }
  return <>{children(query.data)}</>;
}
