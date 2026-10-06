import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'ajies portofolio',
  description: 'Portofolio profesional Putra Raden Al Aziz (ajies). Web Developer & Game Dev asal Bogor, Indonesia. Spesialisasi Next.js, React, UI modern, dan game prototyping.',
  keywords: [
    'Putra Raden Al Aziz',
    'ajies',
    '1dleraden',
    'Web Developer Bogor',
    'Game Developer Indonesia',
    'Next.js Portfolio',
    'Frontend Developer',
    'PPLG'
  ],
  authors: [{ name: 'Putra Raden Al Aziz' }],
  creator: 'Putra Raden Al Aziz',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://github.com/1dleraden',
    title: 'ajies portofolio',
    description: 'Portofolio resmi Putra Raden Al Aziz (ajies). Menampilkan karya aplikasi web modern dan gim interaktif.',
    siteName: 'ajies.dev'
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
