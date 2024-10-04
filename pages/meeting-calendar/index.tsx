import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { i18n, t } from '../../models/Base/Translation';

export const getServerSideProps = compose(translator(i18n));

const PublicMeetingPage: FC = observer(() => (
  <Container className="py-5 text-center">
    <PageHead title={t('meeting_calendar')} />

    <Breadcrumb>
      <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{t('meeting_calendar')}</Breadcrumb.Item>
    </Breadcrumb>

    <h1 className="pb-4">{t('meeting_calendar')}</h1>

    <iframe
      className="w-100 vh-100"
      src="https://kaiyuanshe.feishu.cn/share/base/view/shrcnKA7ds62H6ZwftMSqK026Id"
      allow="fullscreen"
    />
  </Container>
));

export default PublicMeetingPage;
