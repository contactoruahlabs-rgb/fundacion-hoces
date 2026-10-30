import Link from "next/link";
import { Container } from "./Container";
import { ButtonLink } from "./Button";
import { OliveBranchOrnament } from "./BrandOrnament";

type FooterProps = {
  orgName: string;
  legalName: string;
  slogan: string;
  address: string;
  comuna: string;
  region: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  footerText: string;
};

export function Footer(props: FooterProps) {
  const year = new Date().getFullYear();
  const igUrl = props.instagram ? `https://instagram.com/${props.instagram}` : "";
  const fbUrl = props.facebook ? `https://facebook.com/${props.facebook}` : "";
  const waHref = `https://wa.me/${props.whatsapp.replace(/\D/g, "")}`;

  return (
    <footer className="mt-24 border-t-4 border-sage bg-surface-muted">
      <Container className="relative overflow-hidden py-16">
        <OliveBranchOrnament className="pointer-events-none absolute -right-10 -top-6 hidden h-44 w-44 text-sage/40 lg:block" />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-heading text-xl font-bold text-forest">{props.orgName}</p>
            <p className="mt-2 text-sm text-forest/80">{props.slogan}</p>
            {props.footerText && <p className="mt-4 max-w-xs text-xs text-forest/60">{props.footerText}</p>}
            <ButtonLink href={waHref} variant="secondary" className="mt-6 text-xs px-5 py-2.5">
              Escríbenos por WhatsApp
            </ButtonLink>
          </div>

          <div>
            <p className="font-subheading text-sm text-forest">Navegación</p>
            <ul className="mt-4 space-y-2.5 text-sm text-forest/80">
              <li><Link href="/quienes-somos" className="hover:text-olive">Quiénes somos</Link></li>
              <li><Link href="/servicios" className="hover:text-olive">Servicios</Link></li>
              <li><Link href="/equipo" className="hover:text-olive">Equipo</Link></li>
              <li><Link href="/transparencia" className="hover:text-olive">Transparencia y memorias</Link></li>
              <li><Link href="/donaciones" className="hover:text-olive">Donaciones</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-subheading text-sm text-forest">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-sm text-forest/80">
              <li>{props.address}</li>
              <li>{props.comuna}, {props.region}</li>
              {props.phone && <li>{props.phone}</li>}
              {props.email && <li><a href={`mailto:${props.email}`} className="hover:text-olive">{props.email}</a></li>}
              <li><Link href="/contacto" className="hover:text-olive">Formulario de contacto</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-subheading text-sm text-forest">Redes sociales</p>
            <ul className="mt-4 space-y-2.5 text-sm text-forest/80">
              {igUrl && <li><a href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olive">Instagram</a></li>}
              {fbUrl && <li><a href={fbUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olive">Facebook</a></li>}
            </ul>
            <p className="mt-6 font-subheading text-sm text-forest">Legal</p>
            <ul className="mt-3 space-y-2 text-xs text-forest/60">
              <li><Link href="/privacidad" className="hover:text-olive">Política de privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-olive">Términos de uso</Link></li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-5">
        <Container>
          <p className="text-xs text-forest/60">
            © {year} {props.legalName || props.orgName}. Todos los derechos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
}
