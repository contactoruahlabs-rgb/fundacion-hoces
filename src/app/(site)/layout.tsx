import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings, getSiteLogoPath } from "@/lib/site-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, logoPath] = await Promise.all([getSiteSettings(), getSiteLogoPath()]);

  return (
    <>
      <Header orgName={settings.orgName} logoPath={logoPath} whatsapp={settings.whatsapp} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        orgName={settings.orgName}
        legalName={settings.legalName}
        slogan={settings.slogan}
        address={settings.address}
        comuna={settings.comuna}
        region={settings.region}
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        email={settings.email}
        instagram={settings.instagram}
        facebook={settings.facebook}
        footerText={settings.footerText}
      />
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </>
  );
}
