import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/Activity/List';
import activityStore from '../../models/Activity';

export async function getServerSideProps() {
  const list = await activityStore.getList({}, 1);

  return { props: { list: JSON.parse(JSON.stringify(list)) } };
}

export default function ActivityListPage({
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="py-5">
      <PageHead title="精彩活动" />

      <h1 className="mb-5 text-center">精彩活动</h1>

      <ActivityList value={list} />
    </Container>
  );
}
