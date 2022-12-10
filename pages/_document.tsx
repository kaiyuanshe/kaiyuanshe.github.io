import { useStaticRendering } from 'mobx-react';
import { Head, Html, Main, NextScript } from 'next/document';

import { isServer } from '../models/Base';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer());

const Logo = process.env.NEXT_PUBLIC_SITE_LOGO;

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href={Logo} />

        <link rel="manifest" href="/manifest.json" />
        <script src="https://polyfill.kaiyuanshe.cn/feature/PWAManifest.js"></script>

        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/idea-react@0.27.11/dist/index.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
