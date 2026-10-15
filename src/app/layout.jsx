import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'ajies.astro — Putra Raden Al Aziz',
  description: 'Portofolio astronomi & rekayasa perangkat lunak resmi Putra Raden Al Aziz (ajies). Menjelajahi arsitektur Next.js, React, antarmuka visual kosmik, dan gim interaktif.',
  keywords: [
    'Putra Raden Al Aziz',
    'ajies',
    'ajies.astro',
    '1dleraden',
    'Astronomy Web Portfolio',
    'Web Developer Bogor',
    'Game Developer Indonesia',
    'Next.js Portfolio',
    'PPLG'
  ],
  authors: [{ name: 'Putra Raden Al Aziz' }],
  creator: 'Putra Raden Al Aziz',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://github.com/1dleraden',
    title: 'ajies.astro — Putra Raden Al Aziz',
    description: 'Portofolio astronomi & rekayasa perangkat lunak resmi Putra Raden Al Aziz (ajies).',
    siteName: 'ajies.astro'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/ajis.jpeg" type="image/jpeg" />
        <link rel="preload" href="/music/laskar-cinta.mp3" as="audio" type="audio/mpeg" />
      </head>
      <body>
        <SmoothScroll>
          <div className="ambient-mesh" aria-hidden="true" />
          <div className="grid-overlay" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
