"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold font-subheading text-white transition-colors hover:bg-[#15300f] disabled:opacity-50 ${className}`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}
