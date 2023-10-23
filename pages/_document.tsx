import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { DefaultImage } from './api/lark/file/[id]';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href={DefaultImage} />
        <link rel="manifest" href="/manifest.json" />
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
