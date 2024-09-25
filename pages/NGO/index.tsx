import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import { SearchBar } from '../../components/Base/SearchBar';
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
    <PageHead title={t('China_NGO_Map')} />

    <header className="d-flex flex-wrap justify-content-around align-items-center my-4">
      <h1 className="my-4">{t('China_NGO_Map')}</h1>
      <div>
        <Button className="me-2" size="sm" href="/NGO/landscape">
          {t('landscape')}
        </Button>
        <Button
          variant="success"
          size="sm"
          target="_blank"
          href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnM7se94tpQJFcECJVxaWIhd"
        >
          {t('join_NGO_map')}
        </Button>
      </div>

      <SearchBar action="/NGO/search" />
    </header>

    <OpenCollaborationMap
      store={new OrganizationModel(NGO_BASE_ID, NGO_TABLE_ID)}
    />
  </Container>
));

export default OrganizationPage;
