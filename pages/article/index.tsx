import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ArticleList } from '../../components/Article/List';
import articleStore from '../../models/Article';

export async function getServerSideProps() {
  const list = await articleStore.getList({}, 1);

  return { props: { list } };
}

export default function ArticleListPage({
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="py-5">
      <PageHead title="开源文库" />

      <h1 className="mb-5 text-center">开源文库</h1>

      <ArticleList value={list} />
    </Container>
  );
}
