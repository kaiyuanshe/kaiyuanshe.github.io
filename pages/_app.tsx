import type { AppProps } from 'next/app';
import Head from 'next/head';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Icon } from 'idea-react';

import { MainRoutes } from '../components/data';
import MainNav from '../components/MainNav';
import '../styles/globals.less';
import { social } from './api/home';

const Name = process.env.NEXT_PUBLIC_SITE_NAME!,
  Logo = process.env.NEXT_PUBLIC_SITE_LOGO!;

const AppShell: FC<AppProps> = observer(({ Component, pageProps }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <MainNav title={Name} logo={Logo} links={MainRoutes()} />

    <div className="mt-5 pt-4 mainContent">
      <Component {...pageProps} />
    </div>

    <footer className="border-top bg-light text-secondary py-5">
      <Container>
        <Row className="align-items-center small text-center g-0">
          <Col xs={0} md={0} lg={2}></Col>
          <Col xs={12} md={8} lg={6}>
            <Row xs={1} md={2} className="align-items-center">
              <Col>沪 ICP 备 19006015 号</Col>
              <Col>公安备案 31011202006203 号</Col>
            </Row>
          </Col>
          <Col xs={12} md={3} lg={3}>
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
));

export default AppShell;
