import { OliveBranchOrnament } from "./BrandOrnament";

export function PillarRow({
  items,
}: {
  items: { title: string; children: React.ReactNode }[];
}) {
  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12">
      {items.map((item, i) => (
        <div key={item.title} className="contents">
          <div>
            <h3 className="font-heading text-xl font-bold text-forest">{item.title}</h3>
            <div className="mt-3 text-sm leading-relaxed text-forest/75">{item.children}</div>
          </div>
          {i < items.length - 1 && (
            <div className="hidden items-center justify-center md:flex" aria-hidden="true">
              <OliveBranchOrnament className="h-16 w-16 text-sage" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
