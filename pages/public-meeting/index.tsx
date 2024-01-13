import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';

export const getServerSideProps = compose(translator(i18n));

const { t } = i18n;

const PublicMeetingPage: FC = observer(() => (
  <Container className="py-5 text-center">
    <PageHead title={t('public_meeting')} />

    <Breadcrumb>
      <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{t('public_meeting')}</Breadcrumb.Item>
    </Breadcrumb>

    <h1>{t('public_meeting')}</h1>

    <iframe
      className="w-100 vh-100"
      src="https://kaiyuanshe.feishu.cn/share/base/view/shrcnKA7ds62H6ZwftMSqK026Id"
      allow="fullscreen"
    />
  </Container>
));

export default PublicMeetingPage;
