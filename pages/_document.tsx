import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import { LanguageCode, parseSSRContext } from '../models/Base/Translation';
import { DefaultImage } from '../utility/configuration';

interface CustomDocumentProps {
  language: LanguageCode;
  colorScheme: 'light' | 'dark';
}

export default class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(context: DocumentContext) {
    return {
      ...(await Document.getInitialProps(context)),
      ...parseSSRContext<CustomDocumentProps>(context, ['language']),
    };
  }

  render() {
    const { language, colorScheme } = this.props;

    return (
      <Html lang={language} data-bs-theme={colorScheme}>
        <Head>
          <link rel="icon" href={DefaultImage} />
          <link rel="manifest" href="/manifest.json" />
          <script src="https://polyfill.kaiyuanshe.cn/feature/PWAManifest.js" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          />
          <link rel="stylesheet" href="https://unpkg.com/idea-react@2.0.0-rc.13/dist/index.css" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
