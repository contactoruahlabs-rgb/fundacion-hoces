export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sage/25 px-3.5 py-1 text-xs font-semibold font-subheading text-olive">
      {children}
    </span>
  );
}
