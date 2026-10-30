export function Eyebrow({
  children,
  tone = "olive",
}: {
  children: React.ReactNode;
  tone?: "olive" | "white";
}) {
  return (
    <p
      className={`font-subheading text-xs uppercase tracking-[0.18em] ${
        tone === "white" ? "text-sage" : "text-olive"
      }`}
    >
      {children}
    </p>
  );
}
