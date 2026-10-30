"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { ButtonLink } from "./Button";

type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

const NAV_ITEMS: NavItem[] = [
  {
    href: "/quienes-somos",
    label: "Quiénes somos",
    children: [
      { href: "/equipo", label: "Equipo" },
      { href: "/directorio", label: "Directorio" },
      { href: "/transparencia", label: "Transparencia" },
    ],
  },
  { href: "/servicios", label: "Servicios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/testimonios", label: "Testimonios" },
  { href: "/contacto", label: "Contacto" },
];

export function Header({
  orgName,
  logoPath,
  whatsapp,
}: {
  orgName: string;
  logoPath?: string | null;
  whatsapp?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Evita el scroll del fondo mientras el menú de pantalla completa está abierto.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, me gustaría recibir información sobre Fundación HOCES.")}`
    : "/contacto";

  const isActive = (item: NavItem) =>
    pathname === item.href || (item.children?.some((c) => c.href === pathname) ?? false);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-2 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          {logoPath ? (
            <Image src={logoPath} alt={orgName} width={44} height={44} className="h-11 w-11 shrink-0 object-contain" />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-white font-heading font-bold">
              H
            </span>
          )}
          <span className="truncate font-heading text-lg font-bold text-forest">{orgName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 py-1 font-subheading text-sm text-forest transition-colors hover:text-olive"
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {item.children && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="mt-px">
                      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-olive transition-transform duration-200 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                </Link>

                {item.children && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="min-w-[180px] rounded-xl border border-border bg-white py-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 font-subheading text-sm ${
                            pathname === child.href ? "text-olive" : "text-forest hover:text-olive"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Link
          href="/donaciones"
          onClick={closeMenu}
          className="shrink-0 rounded-md bg-olive px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#565f2a] sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Donar
        </Link>

        <button
          type="button"
          className="relative z-50 lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-forest"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => (open ? closeMenu() : setOpen(true))}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>
    </header>

      {/* Menú móvil a pantalla completa (fuera del header: el backdrop-blur del
          header crea un containing block para position:fixed y lo atraparía). */}
      <nav
        id="mobile-menu"
        aria-label="Navegación móvil"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={`fixed inset-0 z-30 flex flex-col bg-white pt-20 transition-all duration-[280ms] ease-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6">
          <Link
            href="/donaciones"
            onClick={closeMenu}
            className="mb-2 mt-4 flex items-center justify-center gap-2 rounded-2xl bg-sage px-5 py-4 text-center font-heading text-base font-bold text-forest shadow-sm transition-colors hover:bg-[#95a558]"
          >
            Donar
          </Link>
          {NAV_ITEMS.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between border-b border-border py-4 font-subheading text-lg ${
                    pathname === item.href ? "text-olive" : "text-forest"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const active = isActive(item);
            return (
              <div key={item.href} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setAboutOpen((v) => !v)}
                  aria-expanded={aboutOpen}
                  className={`flex w-full items-center justify-between py-4 font-subheading text-lg ${
                    active ? "text-olive" : "text-forest"
                  }`}
                >
                  {item.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${
                    aboutOpen ? "grid-rows-[1fr] pb-2 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        className={`block py-3 pl-4 font-subheading text-base ${
                          pathname === child.href ? "text-olive" : "text-forest/80"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-border bg-surface-muted px-6 py-2.5">
          <p className="text-[11px] text-forest/60">¿Prefieres escribirnos directo?</p>
          <div className="mt-1.5 flex gap-2">
            <ButtonLink href={waHref} className="flex-1 justify-center !px-3 !py-1.5 !text-xs">
              WhatsApp
            </ButtonLink>
            <ButtonLink href="/donaciones" variant="ghost" className="flex-1 justify-center !px-3 !py-1.5 !text-xs">
              Colabora
            </ButtonLink>
          </div>
        </div>
      </nav>
    </>
  );
}
