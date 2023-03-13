import { useStaticRendering } from 'mobx-react';
import { Head, Html, Main, NextScript } from 'next/document';

import { isServer } from '../models/Base';
import { DefaultImage } from './api/lark/file/[id]';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer());

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MS73CZKMM3"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }

gtag('js', new Date());

gtag('config', 'G-MS73CZKMM3');
`,
          }}
        />
        <link rel="icon" href={DefaultImage} />

        <link rel="manifest" href="/manifest.json" />
        <script src="https://polyfill.kaiyuanshe.cn/feature/PWAManifest.js" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/idea-react@1.0.0-alpha.0/dist/index.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />
        <script src="https://unpkg.com/cookie-store@3.0.0/index.js" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
