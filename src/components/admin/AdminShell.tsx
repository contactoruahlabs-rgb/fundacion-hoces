"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { logoutAction } from "@/lib/actions/auth-actions";

const NAV_GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Panel",
    items: [{ href: "/admin", label: "Resumen" }],
  },
  {
    title: "Contenido del sitio",
    items: [
      { href: "/admin/inicio", label: "Inicio" },
      { href: "/admin/quienes-somos", label: "Quiénes somos" },
      { href: "/admin/servicios", label: "Programas / Servicios" },
      { href: "/admin/equipo", label: "Equipo" },
      { href: "/admin/noticias", label: "Noticias" },
      { href: "/admin/testimonios", label: "Testimonios" },
      { href: "/admin/preguntas-frecuentes", label: "Preguntas frecuentes" },
    ],
  },
  {
    title: "Documentos y medios",
    items: [
      { href: "/admin/memorias", label: "Memorias y transparencia" },
      { href: "/admin/medios", label: "Biblioteca de imágenes" },
    ],
  },
  {
    title: "Donaciones",
    items: [{ href: "/admin/donaciones", label: "Transbank / Mercado Pago" }],
  },
  {
    title: "Mensajes",
    items: [{ href: "/admin/mensajes", label: "Formularios de contacto" }],
  },
  {
    title: "Configuración y seguridad",
    items: [
      { href: "/admin/configuracion", label: "Configuración general" },
      { href: "/admin/seguridad", label: "Seguridad y registros" },
    ],
  },
];

export function AdminShell({
  children,
  userName,
}: {
  children: ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
        <div className="border-b border-border px-6 py-5">
          <p className="font-heading text-lg font-bold text-forest">Fundación HOCES</p>
          <p className="text-xs text-forest/60">Panel administrativo</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Navegación del panel">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-forest/40">
                {group.title}
              </p>
              <div className="mt-2 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-olive/10 text-olive" : "text-forest/80 hover:bg-surface-muted"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-forest/60">Sesión de</p>
          <p className="text-sm font-medium text-forest">{userName}</p>
          <form action={logoutAction} className="mt-3">
            <button className="text-xs font-semibold text-danger hover:underline" type="submit">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-border bg-white px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <p className="font-heading font-bold text-forest">Fundación HOCES — Panel</p>
            <form action={logoutAction}>
              <button className="text-xs font-semibold text-danger" type="submit">
                Salir
              </button>
            </form>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium text-olive">Menú de secciones</summary>
            <div className="mt-2 flex flex-col gap-1">
              {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-2 py-2 text-sm text-forest/80 hover:bg-surface-muted">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
