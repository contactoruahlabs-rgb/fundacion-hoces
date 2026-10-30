import type { ActionState } from "@/lib/action-state";

export function FormStatusBanner({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <div
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm ${
        state.ok
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      {state.message}
    </div>
  );
}
