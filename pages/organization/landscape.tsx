import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';

const OrganizationLandscape = dynamic(
  () => import('../../components/Organization/LandScape'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n));

const LandscapePage: FC = observer(() => {
  const { t } = i18n;

  return (
    <Container className="mb-5">
      <PageHead title={t('China_open_source_community_landscape')} />

      <h1 className="mt-5 text-center">
        {t('China_open_source_community_landscape')}
      </h1>
      <OrganizationLandscape />
    </Container>
  );
});

export default LandscapePage;
