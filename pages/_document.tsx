import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { DefaultImage } from './api/lark/file/[id]';

export default function Document() {
  return (
    <Html>
      <Head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MS73CZKMM3" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-MS73CZKMM3');
          `}
        </Script>
        <link rel="icon" href={DefaultImage} />

        <link rel="manifest" href="/manifest.json" />
        <Script src="https://polyfill.kaiyuanshe.cn/feature/PWAManifest.js" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
