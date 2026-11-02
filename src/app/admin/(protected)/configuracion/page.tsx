import { getSiteSettings } from "@/lib/site-data";
import { prisma } from "@/lib/prisma";
import { SiteSettingForm } from "@/components/admin/SiteSettingForm";

export default async function AdminSettingsPage() {
  const [settings, media] = await Promise.all([
    getSiteSettings(),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Configuración general</h1>
      <p className="mt-1 text-sm text-forest/60">
        Datos institucionales, contacto, redes sociales y configuración de donaciones.
      </p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <SiteSettingForm settings={settings} mediaOptions={media} />
      </div>
    </div>
  );
}
