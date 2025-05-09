import { observer } from 'mobx-react';
import { compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { OpenCollaborationMap } from '../../components/Organization';
import { I18nContext } from '../../models/Base/Translation';
import { COMMUNITY_BASE_ID } from '../../models/Community';
import {
  OrganizationModel,
  OrganizationStatistic,
  OrganizationStatisticModel,
  OSC_CITY_STATISTIC_TABLE_ID,
  OSC_TAG_STATISTIC_TABLE_ID,
  OSC_TYPE_STATISTIC_TABLE_ID,
  OSC_YEAR_STATISTIC_TABLE_ID,
} from '../../models/Community/Organization';
import { solidCache } from '../api/base';

export const getServerSideProps = compose(solidCache, errorLogger, async () => {
  const [year, city, type, tag] = await Promise.all([
    new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_YEAR_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_CITY_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_TYPE_STATISTIC_TABLE_ID).countAll(),
    new OrganizationStatisticModel(COMMUNITY_BASE_ID, OSC_TAG_STATISTIC_TABLE_ID).countAll(),
  ]);

  return { props: { year, city, type, tag } };
});

const OrganizationPage: FC<OrganizationStatistic> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
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

      <OpenCollaborationMap store={new OrganizationModel()} {...props} />
    </Container>
  );
});
export default OrganizationPage;
