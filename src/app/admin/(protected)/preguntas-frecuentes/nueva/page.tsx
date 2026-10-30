import { FaqForm } from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Nueva pregunta frecuente</h1>
      <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-white p-6 sm:p-8">
        <FaqForm />
      </div>
    </div>
  );
}
