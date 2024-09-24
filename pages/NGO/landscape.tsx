import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import {
  NGO_BASE_ID,
  NGO_TABLE_ID,
  OrganizationModel,
} from '../../models/Community/Organization';

const OrganizationLandscape = dynamic(
  () => import('../../components/Organization/LandScape'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n));

const { t } = i18n;

const LandscapePage: FC = observer(() => (
  <Container className="mb-5">
    <PageHead title={t('China_open_source_community_landscape')} />

    <h1 className="mt-5 text-center">
      {t('China_open_source_community_landscape')}
    </h1>
    <OrganizationLandscape
      store={new OrganizationModel(NGO_BASE_ID, NGO_TABLE_ID)}
    />
  </Container>
));

export default LandscapePage;
