import dynamic from 'next/dynamic';
import { Container, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';

const DepartmentTree = dynamic(() => import('../../components/Group/Tree'), {
  ssr: false,
});

export default function DepartmentPage() {
  return (
    <Container className="py-5 text-center">
      <PageHead title={i18n.t('organization')} />

      <h1>{i18n.t('organization_of_open_source_society')}</h1>

      <DepartmentTree />

      <Button
        size="lg"
        target="_blank"
        href="https://kaiyuanshe.feishu.cn/share/base/shrcnfO89tYlYIjZpS5PXJBaK2f"
      >
        {i18n.t('become_volunteer')}
      </Button>
    </Container>
  );
}
