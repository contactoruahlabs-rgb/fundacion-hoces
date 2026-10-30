import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Términos de uso del sitio web de Fundación HOCES.",
};

export default async function TerminosPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-extrabold text-forest">Términos de uso</h1>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface-muted p-5 text-sm text-forest/70">
          <strong>Borrador pendiente de revisión legal.</strong> Debe ser validado por{" "}
          {settings.legalRepresentative || "la representante legal"} antes de considerarse definitivo.
        </div>

        <div className="prose-content mt-8 space-y-6 text-forest/80">
          <p>
            Este sitio web es operado por {settings.legalName} ({settings.orgName}), RUT {settings.rut}.
            Al utilizar este sitio aceptas los presentes términos de uso.
          </p>
          <p>
            <strong>Contenido informativo.</strong> La información publicada en este sitio tiene fines
            informativos sobre los programas y servicios de la fundación. No reemplaza una evaluación
            profesional directa.
          </p>
          <p>
            <strong>Formularios.</strong> Al enviar un formulario de contacto, aceptas que la información
            entregada sea utilizada exclusivamente para gestionar tu solicitud, conforme a nuestra{" "}
            <a href="/privacidad" className="text-olive underline">
              política de privacidad
            </a>
            .
          </p>
          <p>
            <strong>Propiedad intelectual.</strong> El logotipo, los textos y el material gráfico
            publicado en este sitio pertenecen a {settings.legalName} y no pueden reproducirse sin
            autorización.
          </p>
          <p>
            <strong>Donaciones.</strong> Las donaciones se coordinan directamente con la fundación a
            través de los canales de contacto oficiales. La fundación informará los medios de pago
            disponibles en cada caso.
          </p>
        </div>
      </Container>
    </div>
  );
}
