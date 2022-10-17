import dynamic from 'next/dynamic';
import { Container, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';

const DepartmentTree = dynamic(
  () => import('../../components/DepartmentTree'),
  { ssr: false },
);

export default function DepartmentPage() {
  return (
    <Container className="py-5 text-center">
      <PageHead title="组织机构" />

      <h1>开源社组织机构</h1>

      <DepartmentTree />

      <Button
        size="lg"
        target="_blank"
        href="https://kaiyuanshe.feishu.cn/share/base/shrcnfO89tYlYIjZpS5PXJBaK2f"
      >
        成为志愿者
      </Button>
    </Container>
  );
}
