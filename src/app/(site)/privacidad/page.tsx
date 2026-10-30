import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-data";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Fundación HOCES.",
};

export default async function PrivacidadPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-extrabold text-forest">Política de privacidad</h1>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface-muted p-5 text-sm text-forest/70">
          <strong>Borrador pendiente de revisión legal.</strong> Este texto es un punto de partida
          redactado a partir de la información entregada por la fundación. Antes de publicarlo de forma
          definitiva, debe ser revisado por {settings.legalRepresentative || "la representante legal"} o
          un profesional competente en protección de datos en Chile (Ley 19.628 y su actualización por la
          Ley 21.719).
        </div>

        <div className="prose-content mt-8 space-y-6 text-forest/80">
          <p>
            {settings.legalName} ({settings.orgName}), RUT {settings.rut}, con domicilio en{" "}
            {settings.address}, {settings.comuna}, {settings.region}, es responsable del tratamiento de
            los datos personales que se recopilan a través de este sitio web.
          </p>
          <p>
            <strong>Datos que recopilamos.</strong> Únicamente solicitamos los datos estrictamente
            necesarios para responder tus consultas: nombre, correo electrónico, teléfono (opcional) y el
            contenido de tu mensaje. No solicitamos información médica o diagnóstica a través de los
            formularios públicos del sitio.
          </p>
          <p>
            <strong>Niños, niñas y adolescentes.</strong> Dado que trabajamos con menores de edad,
            cualquier fotografía, testimonio o dato relativo a un niño, niña o adolescente solo se publica
            con la autorización expresa y por escrito de su madre, padre o tutor legal. Esa autorización
            puede ser revocada en cualquier momento escribiendo a nuestros canales de contacto.
          </p>
          <p>
            <strong>Uso de los datos.</strong> Los datos recibidos a través del formulario de contacto se
            usan exclusivamente para responder la consulta realizada y no se comparten con terceros, salvo
            obligación legal.
          </p>
          <p>
            <strong>Conservación.</strong> Los mensajes de contacto se conservan mientras sean necesarios
            para gestionar la consulta y, posteriormente, por un plazo razonable para fines de respaldo
            administrativo.
          </p>
          <p>
            <strong>Tus derechos.</strong> Puedes solicitar acceso, rectificación, cancelación u oposición
            al tratamiento de tus datos personales escribiéndonos a nuestros canales de contacto oficiales.
          </p>
        </div>
      </Container>
    </div>
  );
}
