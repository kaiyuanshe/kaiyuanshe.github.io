import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Base/Translation';

const DepartmentTree = dynamic(() => import('../../components/Department/Tree'), { ssr: false });

const DepartmentPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-5 text-center">
      <PageHead title={t('organization_structure')} />

      <h1 className="my-4">{t('organization_structure_chart')}</h1>

      <DepartmentTree />
    </Container>
  );
});
export default DepartmentPage;
