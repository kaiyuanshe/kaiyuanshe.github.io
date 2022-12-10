import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ArticleList } from '../../components/Article/List';
import articleStore from '../../models/Article';
import { i18n } from '../../models/Translation';

export async function getServerSideProps() {
  const list = await articleStore.getList({}, 1);

  return { props: { list } };
}

const ArticleListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => {
  const { t } = i18n;

  return (
    <Container className="py-5">
      <PageHead title={t('open_source_library')} />

      <h1 className="mb-5 text-center">{t('open_source_library')}</h1>

      <ArticleList value={list} />
    </Container>
  );
});

export default ArticleListPage;
