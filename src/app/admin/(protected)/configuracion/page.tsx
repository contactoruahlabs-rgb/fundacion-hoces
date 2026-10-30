import { getSiteSettings } from "@/lib/site-data";
import { SiteSettingForm } from "@/components/admin/SiteSettingForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Configuración general</h1>
      <p className="mt-1 text-sm text-forest/60">
        Datos institucionales, contacto, redes sociales y configuración de donaciones.
      </p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <SiteSettingForm settings={settings} />
      </div>
    </div>
  );
}
