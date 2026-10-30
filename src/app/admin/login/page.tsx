"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/action-state";
import { TextInput, FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        <p className="font-heading text-lg font-bold text-forest">Fundación HOCES</p>
        <p className="text-sm text-forest/60">Acceso al panel administrativo</p>

        <form action={formAction} className="mt-8 space-y-5" noValidate>
          <FormField label="Correo electrónico" name="email" required error={state.fieldErrors?.email}>
            <TextInput id="email" name="email" type="email" autoComplete="username" required />
          </FormField>
          <FormField label="Contraseña" name="password" required error={state.fieldErrors?.password}>
            <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
          </FormField>

          <FormStatusBanner state={state} />

          <SubmitButton className="w-full">Iniciar sesión</SubmitButton>
        </form>
      </div>
    </div>
  );
}
