import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
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
          <Row xs={1} md={3} className="align-items-center small text-center">
            <Col></Col>
            <Col>
              <Row xs={1} md={2} className="align-items-center">
                <Col>沪 ICP 备 19006015 号</Col>
                <Col>公安备案 31011202006203 号</Col>
              </Row>
            </Col>
            <Col>
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
