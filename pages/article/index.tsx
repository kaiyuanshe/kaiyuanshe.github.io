import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, errorLogger, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import { PageHead } from '../../components/Layout/PageHead';
import { i18n, I18nContext } from '../../models/Base/Translation';
import articleStore, { Article, ArticleModel } from '../../models/Product/Article';

interface ArticleListPageProps extends RouteProps {
  list: Article[];
}

export const getServerSideProps = compose<{}, ArticleListPageProps>(
  router,
  errorLogger,
  async ({ query }) => {
    const list = await new ArticleModel().getList({ type: query.type }, 1);

    return { props: { list } as ArticleListPageProps };
  },
);

const ArticleListPage: FC<ArticleListPageProps> = observer(({ route: { query }, list }) => {
  const { t } = useContext(I18nContext);

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
