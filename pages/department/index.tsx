import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';

const DepartmentTree = dynamic(
  () => import('../../components/Department/Tree'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n));

const { t } = i18n;

const DepartmentPage: FC = observer(() => (
  <Container className="py-5 text-center">
    <PageHead title={t('organization_structure')} />

    <h1>{t('organization_structure_chart')}</h1>

    <DepartmentTree />

    <Button
      size="lg"
      target="_blank"
      href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnlDoJhBTHalhmiZJr8rax0g"
    >
      {t('become_volunteer')}
    </Button>
  </Container>
));

export default DepartmentPage;
