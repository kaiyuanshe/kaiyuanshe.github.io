import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container } from 'react-bootstrap';
import { ScrollList } from 'mobx-restful-table';

import PageHead from '../../components/PageHead';
// import { ArticleList } from '../../components/Article/List';
import { ArticleListLayout } from '../../components/Article/List';
import articleStore, { ArticleModel } from '../../models/Article';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

export const getServerSideProps = withTranslation(async () => {
  const list = await new ArticleModel().getList({}, 1);

  return { props: { list } };
});

const ArticleListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => {
  const { t } = i18n;

  return (
    <Container className="py-5">
      <PageHead title={t('our_blogs')} />

      <h1 className="mb-5 text-center">{t('our_blogs')}</h1>

      {/* <ArticleList store={articleStore} defaultData={list} /> */}
      {/* <ScrollList
        translator={i18n}
        store={articleStore}
        renderList={allItems => <ArticleListLayout data={allItems} />}
        data={list}
      /> */}
    </Container>
  );
});

export default ArticleListPage;
