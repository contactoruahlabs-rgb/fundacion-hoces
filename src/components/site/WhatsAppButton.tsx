function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function WhatsAppButton({
  whatsapp,
  message = "Hola, me gustaría recibir información sobre Fundación HOCES.",
}: {
  whatsapp: string;
  message?: string;
}) {
  const phone = digitsOnly(whatsapp);
  if (!phone) return null;

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.654 4.527 1.787 6.39L4 29l7.81-1.748A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6a9.55 9.55 0 0 1-4.87-1.333l-.35-.207-4.63 1.036 1.012-4.51-.228-.368A9.57 9.57 0 0 1 5.4 15c0-5.853 4.75-10.6 10.604-10.6 5.853 0 10.596 4.747 10.596 10.6 0 5.853-4.743 10.6-10.596 10.6Zm5.84-7.94c-.32-.16-1.886-.93-2.178-1.037-.293-.107-.506-.16-.72.16-.213.32-.826 1.037-1.012 1.25-.187.213-.374.24-.693.08-.32-.16-1.35-.498-2.572-1.588-.95-.847-1.592-1.894-1.778-2.213-.187-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.026-.56-.08-.16-.72-1.734-.986-2.374-.26-.627-.526-.542-.72-.552l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.258 3.447 5.47 4.833.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.886-.77 2.152-1.513.267-.744.267-1.38.187-1.513-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </a>
  );
}
