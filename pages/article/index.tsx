import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import PageHead from '../../components/PageHead';
import articleStore, { ArticleModel } from '../../models/Article';
import { i18n } from '../../models/Translation';

export const getServerSideProps = compose(translator(i18n), async () => {
  const list = await new ArticleModel().getList({}, 1);

  return { props: { list } };
});

const ArticleListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => {
  const { t } = i18n;

  return (
    <Container className="py-5">
      <PageHead title={t('our_articles')} />

      <h1 className="mb-5 text-center">{t('our_articles')}</h1>

      <ScrollList
        translator={i18n}
        store={articleStore}
        renderList={allItems => <ArticleListLayout defaultData={allItems} />}
        defaultData={list}
      />
    </Container>
  );
});

export default ArticleListPage;
