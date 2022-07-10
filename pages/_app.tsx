import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
import { Icon } from 'idea-react';

import { MainRoute } from '../components/data';
import MainNav from '../components/MainNav';
import '../styles/globals.less';
import { social } from './api/home';

const Name = process.env.NEXT_PUBLIC_SITE_NAME!,
  Logo = process.env.NEXT_PUBLIC_SITE_LOGO!;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNav title={Name} logo={Logo} links={Object.values(MainRoute)} />

      <div className="mt-5 pt-4">
        <Component {...pageProps} />
      </div>

      <footer className="border-top bg-light text-secondary py-5">
        <Container>
          <Row className="justify-content-between align-items-center small">
            <Col></Col>
            <Col className="text-nowrap">
              <span>沪 ICP 备 19006015 号</span>
              <span className="ms-3">公安备案 31011202006203 号</span>
            </Col>
            <Col xs="auto">
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
          </Row>
        </Container>
      </footer>
    </>
  );
}
