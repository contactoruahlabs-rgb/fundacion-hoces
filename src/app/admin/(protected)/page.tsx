import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getCounts() {
  const [
    programs,
    news,
    documents,
    team,
    testimonials,
    newMessages,
    totalMessages,
    media,
    donations,
  ] = await Promise.all([
    prisma.program.count({ where: { status: "PUBLISHED" } }),
    prisma.newsPost.count({ where: { status: "PUBLISHED" } }),
    prisma.document.count({ where: { status: "PUBLISHED" } }),
    prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
    prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.media.count(),
    prisma.donation.groupBy({ by: ["status"], _count: true }),
  ]);
  return { programs, news, documents, team, testimonials, newMessages, totalMessages, media, donations };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Servicios publicados", value: counts.programs, href: "/admin/servicios" },
    { label: "Noticias publicadas", value: counts.news, href: "/admin/noticias" },
    { label: "Documentos de transparencia", value: counts.documents, href: "/admin/memorias" },
    { label: "Profesionales publicados", value: counts.team, href: "/admin/equipo" },
    { label: "Testimonios publicados", value: counts.testimonials, href: "/admin/testimonios" },
    { label: "Imágenes en biblioteca", value: counts.media, href: "/admin/medios" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Resumen</h1>
      <p className="mt-1 text-sm text-forest/60">
        Estado actual del contenido publicado en el sitio.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-white p-6 hover:shadow-sm"
          >
            <p className="font-heading text-3xl font-extrabold text-forest">{card.value}</p>
            <p className="mt-1 text-sm text-forest/60">{card.label}</p>
          </Link>
        ))}

        <Link
          href="/admin/mensajes"
          className="rounded-2xl border border-olive/40 bg-olive/5 p-6 hover:shadow-sm"
        >
          <p className="font-heading text-3xl font-extrabold text-olive">{counts.newMessages}</p>
          <p className="mt-1 text-sm text-forest/70">
            Mensajes nuevos sin leer ({counts.totalMessages} en total)
          </p>
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted p-6">
        <h2 className="font-subheading text-base text-forest">Estado de las pasarelas de pago</h2>
        <p className="mt-2 text-sm text-forest/70">
          Webpay Plus está conectado en <strong>modo de prueba</strong> (ambiente de integración de
          Transbank, sin cobros reales); Mercado Pago aún no está conectado. Faltan las credenciales
          comerciales oficiales de la fundación para pasar a producción. Donaciones registradas hasta
          ahora: {counts.donations.reduce((acc, d) => acc + d._count, 0)}.
        </p>
        <Link href="/admin/donaciones" className="mt-3 inline-block text-sm font-semibold text-olive hover:underline">
          Ver detalle →
        </Link>
      </div>
    </div>
  );
}
