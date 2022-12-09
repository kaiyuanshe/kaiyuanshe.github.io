import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ArticleList } from '../../components/Article/List';
import articleStore from '../../models/Article';
import { i18n } from '../../models/Translation';

export async function getServerSideProps() {
  const list = await articleStore.getList({}, 1);

  return { props: { list } };
}

export default function ArticleListPage({
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="py-5">
      <PageHead title={i18n.t('open_source_library')} />

      <h1 className="mb-5 text-center">{i18n.t('open_source_library')}</h1>

      <ArticleList value={list} />
    </Container>
  );
}
