import dynamic from 'next/dynamic';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

const DepartmentTree = dynamic(() => import('../../components/Group/Tree'), {
  ssr: false,
});

export const getServerSideProps = withTranslation();

const DepartmentPage: FC = observer(() => {
  const { t } = i18n;

  return (
    <Container className="py-5 text-center">
      <PageHead title={t('our_community_structure')} />

      <h1>{t('organization_of_open_source_society')}</h1>

      <DepartmentTree />

      <Button
        size="lg"
        target="_blank"
        href="https://kaiyuanshe.feishu.cn/share/base/shrcnfO89tYlYIjZpS5PXJBaK2f"
      >
        {t('become_volunteer')}
      </Button>
    </Container>
  );
});

export default DepartmentPage;
