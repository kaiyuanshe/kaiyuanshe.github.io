import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import articleStore, {
  Article,
  ArticleModel,
} from '../../models/Product/Article';

interface ArticleListPageProps extends RouteProps {
  list: Article[];
}

export const getServerSideProps = compose<{}, ArticleListPageProps>(
  router,
  errorLogger,
  translator(i18n),
  async ({ query }) => {
    const list = await new ArticleModel().getList({ type: query.type }, 1);

    return { props: { list } as ArticleListPageProps };
  },
);

const { t } = i18n;

const ArticleListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ route: { query }, list }) => {
  const title = [query.type, t('our_knowledge_base')].filter(Boolean);

  return (
    <Container className="py-5">
      <PageHead title={title.join(' - ')} />

      <h1 className="mb-5 text-center">{[...title].reverse().join(' - ')}</h1>

      <ScrollList
        translator={i18n}
        store={articleStore}
        filter={query}
        renderList={allItems => <ArticleListLayout defaultData={allItems} />}
        defaultData={list}
      />
    </Container>
  );
});

export default ArticleListPage;
