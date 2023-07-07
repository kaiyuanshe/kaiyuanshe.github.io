import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

const OrganizationLandscape = dynamic(
  () => import('../../components/Organization/LandScape'),
  { ssr: false },
);

export const getServerSideProps = withTranslation();

const LandscapePage: FC = observer(() => {
  const { t } = i18n;

  return (
    <Container className="mb-5">
      <PageHead title={t('panorama_of_china_open_source_community')} />

      <h2 className="mt-5 text-center">
        {t('panorama_of_china_open_source_community')}
      </h2>
      <OrganizationLandscape />
    </Container>
  );
});

export default LandscapePage;
