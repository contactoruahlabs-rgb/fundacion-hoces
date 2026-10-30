import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos a Fundación HOCES: dirección, teléfono, WhatsApp y formulario de contacto.",
};

export default async function ContactoPage() {
  const settings = await getSiteSettings();
  const mapQuery = encodeURIComponent(`${settings.address}, ${settings.comuna}, ${settings.region}, Chile`);

  return (
    <div className="py-16 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="font-subheading text-sm uppercase tracking-wide text-olive">Contacto</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-forest">Hablemos</h1>
          <p className="mt-4 text-forest/70">
            Escríbenos y te responderemos a la brevedad. Para agendar una hora, lo más rápido es
            contactarnos directamente por WhatsApp.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-subheading text-forest">Dirección</dt>
              <dd className="text-forest/70">
                {settings.address}, {settings.comuna}, {settings.region}
              </dd>
            </div>
            <div>
              <dt className="font-subheading text-forest">Teléfono / WhatsApp</dt>
              <dd className="text-forest/70">{settings.phone}</dd>
            </div>
            {settings.email && (
              <div>
                <dt className="font-subheading text-forest">Correo</dt>
                <dd className="text-forest/70">{settings.email}</dd>
              </div>
            )}
            <div>
              <dt className="font-subheading text-forest">Horario de atención</dt>
              <dd className="text-forest/70">Todos los días, de 10:00 a 19:00 hrs (según disponibilidad de cada profesional).</dd>
            </div>
          </dl>

          <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Ubicación de Fundación HOCES"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <ContactForm whatsapp={settings.whatsapp} />
        </div>
      </Container>
    </div>
  );
}
