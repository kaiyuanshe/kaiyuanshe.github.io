import '../styles/globals.less';

import { DialogClose, Icon } from 'idea-react';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { enableStaticRendering, observer } from 'mobx-react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { Col, Container, Row } from 'react-bootstrap';

import { MainRoutes } from '../components/data';
import MainNav from '../components/Layout/MainNav';
import { MDXLayout } from '../components/Layout/MDX';
import {
  createI18nStore,
  I18nContext,
  I18nProps,
  loadSSRLanguage,
} from '../models/Base/Translation';
import { DefaultImage, isServer } from '../utility/configuration';
import { social } from './api/home';

configure({ enforceActions: 'never' });

enableStaticRendering(isServer());

@observer
export default class CustomApp extends App<I18nProps> {
  static async getInitialProps(context: AppContext) {
    return {
      ...(await App.getInitialProps(context)),
      ...(await loadSSRLanguage(context.ctx)),
    };
  }

  i18nStore = createI18nStore(this.props.language, this.props.languageMap);

  componentDidMount() {
    window.addEventListener('unhandledrejection', ({ reason }) => {
      if (reason instanceof DialogClose) return;

      let { message } = reason as HTTPError;
      const { statusText, body } = reason.response || {};

      message = body?.message || statusText || message;

      if (message) alert(message);
    });
  }

  render() {
    const { Component, pageProps, router } = this.props,
      { t } = this.i18nStore;

    return (
      <I18nContext.Provider value={this.i18nStore}>
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
          src="https://aitable.ai/file/js/aitable_widget.js?v=0.0.1"
          async
        />
        <MainNav title={t('KaiYuanShe')} logo={DefaultImage} links={MainRoutes(this.i18nStore)} />

        {router.asPath.startsWith('/article/Wiki/') ? (
          <MDXLayout title={router.asPath.split('/').at(-1)}>
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
              <Col xs={12} sm={1} className="position-relative">
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
      </I18nContext.Provider>
    );
  }
}
