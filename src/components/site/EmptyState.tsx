export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-8 py-16 text-center">
      <p className="font-heading text-lg font-bold text-forest">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-forest/70">{description}</p>
    </div>
  );
}
