import { getAboutContent } from "@/lib/site-data";
import { AboutContentForm } from "@/components/admin/AboutContentForm";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Quiénes somos</h1>
      <p className="mt-1 text-sm text-forest/60">
        Edita la historia, misión, visión, valores, hitos y enfoque cristiano que se muestran en el sitio.
      </p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <AboutContentForm about={about} />
      </div>
    </div>
  );
}
