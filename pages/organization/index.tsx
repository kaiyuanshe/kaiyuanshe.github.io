import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { OpenCollaborationMap } from '../../components/Organization';
import { i18n, t } from '../../models/Base/Translation';
import { OrganizationModel } from '../../models/Community/Organization';

export const getServerSideProps = compose(translator(i18n));

const OrganizationPage: FC = observer(() => (
  <Container>
    <PageHead title={t('China_Open_Source_Map')} />

    <header className="d-flex justify-content-between align-items-center">
      <h1 className="my-4">{t('China_Open_Source_Map')}</h1>
      <div>
        <Button className="me-2" size="sm" href="/organization/landscape">
          {t('landscape')}
        </Button>
        <Button
          variant="success"
          size="sm"
          target="_blank"
          href="https://kaiyuanshe.feishu.cn/share/base/form/shrcntLXo6z1Zyv5uLjF1z8Lpic"
        >
          {t('join_the_open_source_map')}
        </Button>
      </div>
    </header>

    <OpenCollaborationMap store={new OrganizationModel()} />
  </Container>
));

export default OrganizationPage;
