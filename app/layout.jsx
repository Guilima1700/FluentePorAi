import "./globals.css";
import "./community.css";

export const metadata = {
  title: "Fluente por Aí | English that takes you places",
  description:
    "Aprenda inglês para se comunicar com confiança, desenvolver sua carreira e explorar novas oportunidades pelo mundo. Aulas online, programas personalizados e foco na comunicação real.",
  icons: { icon: "/brand/emblema-creme.png" },
  openGraph: {
    title: "Fluente por Aí | English that takes you places",
    description:
      "Aulas online, programas personalizados e experiências de aprendizagem focadas na comunicação real.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#FEF0D5",
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
      <body>{children}</body>
    </html>
  );
}
