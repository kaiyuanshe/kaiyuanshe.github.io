import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({
  resolvedUrl,
}) => ({
  redirect: {
    destination: `${resolvedUrl}/${new Date().getFullYear()}`,
    permanent: false,
  },
});

export default function DepartmentPage() {
  return <></>;
}
