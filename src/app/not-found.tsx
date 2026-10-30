import { Container } from "@/components/site/Container";
import { ButtonLink } from "@/components/site/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center py-20">
      <Container className="max-w-xl text-center">
        <p className="font-heading text-6xl font-extrabold text-sage">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-forest">
          No encontramos esta página
        </h1>
        <p className="mt-3 text-forest/70">
          Puede que el contenido que buscas haya cambiado de dirección. Vuelve al inicio o escríbenos si
          crees que esto es un error.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
          <ButtonLink href="/contacto" variant="ghost">
            Contactar
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
