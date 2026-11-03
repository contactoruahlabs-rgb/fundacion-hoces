"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

export type ReorderItem = {
  id: string;
  label: string;
  sublabel?: string;
  thumbnail?: string | null;
};

export function ReorderPanel({
  items,
  onSave,
  title = "Orden de aparición en el sitio",
}: {
  items: ReorderItem[];
  onSave: (orderedIds: string[]) => Promise<void>;
  title?: string;
}) {
  const [order, setOrder] = useState(items);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOrder(items);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join(",")]);

  const dirty = order.some((item, i) => item.id !== items[i]?.id);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(order.map((item) => item.id));
      setSaved(true);
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-forest">{title}</h3>
          <p className="text-xs text-forest/60">Usa las flechas para reordenar y luego guarda los cambios.</p>
        </div>
        <button
          type="button"
          disabled={!dirty || isPending}
          onClick={handleSave}
          className="shrink-0 rounded-full bg-olive px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
      {saved && !dirty && <p className="mt-2 text-xs font-medium text-success">Orden guardado y publicado.</p>}
      <ol className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
        {order.map((item, i) => (
          <li key={item.id} className="flex items-center gap-3 bg-white px-3 py-2.5">
            {item.thumbnail ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.thumbnail} alt="" fill className="object-cover" sizes="40px" />
              </div>
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage/15 text-xs font-semibold text-olive">
                {i + 1}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-forest">{item.label}</p>
              {item.sublabel && <p className="truncate text-xs text-forest/60">{item.sublabel}</p>}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                aria-label="Mover arriba"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-forest/70 hover:bg-sage/15 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === order.length - 1}
                onClick={() => move(i, 1)}
                aria-label="Mover abajo"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-forest/70 hover:bg-sage/15 disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
