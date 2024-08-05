import '../styles/globals.less';

import { Icon } from 'idea-react';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { MainRoutes } from '../components/data';
import MainNav from '../components/Layout/MainNav';
import { MDXLayout } from '../components/Layout/MDX';
import { isServer } from '../models/Base';
import { i18n } from '../models/Base/Translation';
import { social } from './api/home';
import { DefaultImage } from './api/lark/file/[id]';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  var { message, statusText, body } = reason as HTTPError;

  message = body?.message || statusText || message;

  if (message) alert(message);
});

const { t } = i18n;

const AppShell: FC<AppProps> = observer(({ Component, pageProps, router }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <GoogleAnalytics strategy="lazyOnload" trackPageViews />
    <Script id="AITable-meta">
      {`window.__aitable = window.__aitable || {};
window.__aitable.share = "shrLPzmeV2iapzGSowywU";
window.__aitable.baseUrl = "https://aitable.ai";`}
    </Script>
    <Script
      id="AITable-widget"
      async
      src="https://aitable.ai/file/js/aitable_widget.js?v=0.0.1"
    ></Script>

    <MainNav title={t('KaiYuanShe')} logo={DefaultImage} links={MainRoutes()} />

    {router.route.startsWith('/article/original/') ? (
      <MDXLayout title={router.route.split('/').at(-1)}>
        <Component {...pageProps} />
      </MDXLayout>
    ) : (
      <div className="mt-5 pt-4 mainContent">
        <Component {...pageProps} />
      </div>
    )}

    <footer className="border-top bg-light text-secondary py-5">
      <Container>
        <Row className="align-items-center small text-center g-2">
          <Col xs={12} sm={8}>
            <Row xs={1} md={2} className="align-items-center">
              <Col>沪 ICP 备 19006015 号</Col>
              <Col>公安备案 31011202006203 号</Col>
            </Row>
          </Col>
          <Col xs={12} sm={3}>
            {Object.entries(social).map(([name, value]) => (
              <a
                key={name}
                className="mx-3 text-secondary"
                target="_blank"
                rel="noreferrer"
                href={value}
              >
                <Icon name={name} size={1.5} />
              </a>
            ))}
          </Col>
          <Col xs={12} sm={1}>
            <a
              className="stretched-link"
              target="_blank"
              href="https://monitor.kaiyuanshe.cn/status/service"
              rel="noreferrer"
            >
              <Icon name="hdd-network" size={1.5} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  </>
));

export default AppShell;
