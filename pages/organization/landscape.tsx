import dynamic from 'next/dynamic';
import PageHead from '../../components/PageHead';

const OrganizationLandscape = dynamic(
  () => import('../../components/Organization/LandScape'),
  { ssr: false },
);

export default function LandscapePage() {
  return (
    <>
      <PageHead title="中国开源社区全景图" />

      <h2 className="mt-5 text-center">中国开源社区全景图</h2>

      <OrganizationLandscape />
    </>
  );
}
