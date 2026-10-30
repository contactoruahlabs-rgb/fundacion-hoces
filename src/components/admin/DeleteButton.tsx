"use client";

export function DeleteButton({
  action,
  confirmMessage = "¿Seguro que quieres eliminar este elemento? Esta acción no se puede deshacer.",
}: {
  action: () => Promise<unknown>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={async () => {
        await action();
      }}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button className="font-semibold text-danger hover:underline" type="submit">
        Eliminar
      </button>
    </form>
  );
}
