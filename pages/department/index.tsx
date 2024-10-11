import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { i18n, t } from '../../models/Base/Translation';

const DepartmentTree = dynamic(
  () => import('../../components/Department/Tree'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n));

const DepartmentPage: FC = observer(() => (
  <Container className="py-5 text-center">
    <PageHead title={t('organization_structure')} />

    <h1 className="my-4">{t('organization_structure_chart')}</h1>

    <DepartmentTree />
  </Container>
));

export default DepartmentPage;
