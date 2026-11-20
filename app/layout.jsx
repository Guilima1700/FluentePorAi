import "./globals.css";
import "./community.css";
import "./globe.css";
import "./vibrant.css";
import "./faq.css";
import "./refinements.css";
import "./conversion.css";
import "./seo.css";
import Script from 'next/script';
import { siteUrl, siteDescription, socialImage, indexable } from '../lib/site.mjs';

const googleAnalyticsId = 'G-6XYQK6SFFP';

export const metadata = {
  metadataBase:new URL(siteUrl),
  title: "Fluente por Aí | Cursos de inglês online",
  description:
    siteDescription,
  applicationName:'Fluente por Aí',
  robots:{index:indexable,follow:true,googleBot:{index:indexable,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  verification:process.env.GOOGLE_SITE_VERIFICATION ? {google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
  twitter:{card:'summary_large_image',title:'Fluente por Aí | Cursos de inglês online',description:siteDescription,images:[socialImage.url]},
  icons: { icon: "/brand/emblema-creme.png" },
  openGraph: {
    title: "Fluente por Aí | Cursos de inglês online",
    siteName:'Fluente por Aí', images:[socialImage],
    description:
      "Aulas online, programas personalizados e experiências de aprendizagem focadas na comunicação real.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#C1121F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=Urbanist:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Sem JavaScript, o conteúdo animado continua visível */}
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
