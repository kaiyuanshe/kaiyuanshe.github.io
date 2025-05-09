import { observer } from 'mobx-react';
import { compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { SearchBar } from '../../components/Base/SearchBar';
import { PageHead } from '../../components/Layout/PageHead';
import { OpenCollaborationMap } from '../../components/Organization';
import { I18nContext } from '../../models/Base/Translation';
import {
  NGO_BASE_ID,
  NGO_CITY_STATISTIC_TABLE_ID,
  NGO_TABLE_ID,
  NGO_TAG_STATISTIC_TABLE_ID,
  NGO_TYPE_STATISTIC_TABLE_ID,
  NGO_YEAR_STATISTIC_TABLE_ID,
  OrganizationModel,
  OrganizationStatistic,
  OrganizationStatisticModel,
} from '../../models/Community/Organization';
import { solidCache } from '../api/base';

export const getServerSideProps = compose(solidCache, errorLogger, async () => {
  const [year, city, type, tag] = await Promise.all([
    new OrganizationStatisticModel(NGO_BASE_ID, NGO_YEAR_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(NGO_BASE_ID, NGO_CITY_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(NGO_BASE_ID, NGO_TYPE_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(NGO_BASE_ID, NGO_TAG_STATISTIC_TABLE_ID).countAll(),
  ]);

  return { props: { year, city, type, tag } };
});

const OrganizationPage: FC<OrganizationStatistic> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
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

        <SearchBar action="/search/NGO" />
      </header>

      <OpenCollaborationMap store={new OrganizationModel(NGO_BASE_ID, NGO_TABLE_ID)} {...props} />
    </Container>
  );
});
export default OrganizationPage;
