import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { OpenCollaborationMap } from '../../components/Organization';
import { i18n } from '../../models/Base/Translation';
import {
  NGO_BASE_ID,
  NGO_TABLE_ID,
  OrganizationModel,
} from '../../models/Community/Organization';

export const getServerSideProps = compose(translator(i18n));

const { t } = i18n;

const OrganizationPage: FC = observer(() => (
  <Container>
    <PageHead title={t('china_open_source_landscape')} />

    <header className="d-flex justify-content-between align-items-center">
      <h1 className="my-4">{t('china_open_source_map')}</h1>
      <div>
        <Button className="me-2" size="sm" href="/NGO/landscape">
          {t('panorama')}
        </Button>
        <Button
          variant="success"
          size="sm"
          target="_blank"
          href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnM7se94tpQJFcECJVxaWIhd"
        >
          {t('join_the_open_source_map')}
        </Button>
      </div>
    </header>

    <OpenCollaborationMap
      store={new OrganizationModel(NGO_BASE_ID, NGO_TABLE_ID)}
    />
  </Container>
));

export default OrganizationPage;
