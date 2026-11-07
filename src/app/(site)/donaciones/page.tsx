import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { OliveBranchOrnament } from "@/components/site/BrandOrnament";
import { DonationWidget } from "@/components/site/DonationWidget";

export const metadata: Metadata = {
  title: "Donaciones",
  description: "Apoya a Fundación HOCES: tu aporte financia becas de terapia, medicamentos y consultas con especialistas.",
};

export default async function DonacionesPage() {
  const settings = await getSiteSettings();
  const amounts: number[] = JSON.parse(settings.donationSuggestedAmounts || "[]");

  return (
    <div>
      {/* ───────────── Panel + tarjeta de donación superpuesta ───────────── */}
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-br from-forest to-olive pb-10 pt-8 sm:pb-14 sm:pt-10">
          <OliveBranchOrnament className="pointer-events-none absolute -right-10 top-6 h-56 w-56 text-white/10 sm:h-72 sm:w-72" />
          <Container className="relative max-w-3xl">
            <p className="font-subheading text-xs uppercase tracking-[0.18em] text-sage">Donaciones</p>
            <h1 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-4xl">
              Ayúdanos a seguir cosechando sueños
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              Tu aporte financia becas de terapia, medicamentos y consultas con especialistas externos para
              familias que no pueden costearlas.
            </p>
          </Container>
        </div>

        <Container className="relative -mt-4 max-w-3xl sm:-mt-6">
          <DonationWidget amounts={amounts} whatsapp={settings.whatsapp} />
        </Container>
      </section>

      {/* ───────────── Pilares informativos ───────────── */}
      <section className="py-20">
        <Container className="max-w-5xl">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-forest">La necesidad</h3>
              <p className="mt-3 text-sm leading-relaxed text-forest/75">
                Muchas familias con niños, niñas y adolescentes neurodivergentes no cuentan con los recursos
                para costear terapias, evaluaciones o especialistas externos de forma sostenida en el tiempo.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-forest">Nuestro compromiso</h3>
              <p className="mt-3 text-sm leading-relaxed text-forest/75">
                Impulsamos becas y apoyos que permiten a niños, niñas, adolescentes y sus familias continuar
                sus procesos terapéuticos, incluso cuando los recursos económicos son una dificultad.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-forest">Tu aporte</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-forest/75">
                <li>Becas de terapia para familias que no pueden costearlas.</li>
                <li>Medicamentos.</li>
                <li>Consultas con especialistas externos necesarios.</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
