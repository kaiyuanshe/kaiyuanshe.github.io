import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { GitCard } from '../../components/Git/Card';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import repositoryStore, { RepositoryModel } from '../../models/Repository';

const { t } = i18n;

export const getServerSideProps = compose(
  cache(),
  errorLogger,
  translator(i18n),
  async () => {
    const list = await new RepositoryModel().getList({
      relation: ['languages'],
    });
    return { props: { list } };
  },
);

const ProjectListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => (
  <Container>
    <PageHead title={t('kaiyuanshe_projects')} />
    <h1 className="my-4">{t('kaiyuanshe_projects')}</h1>

    {repositoryStore.downloading > 0 && <Loading />}

    <ScrollList
      translator={i18n}
      store={repositoryStore}
      filter={{
        relation: ['languages'],
      }}
      renderList={allItems => (
        <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
          {allItems.map(
            item =>
              item.homepage && (
                <Col as="li" key={item.id}>
                  <GitCard className="h-100 shadow-sm" {...item} />
                </Col>
              ),
          )}
        </Row>
      )}
      defaultData={list}
    />
  </Container>
));

export default ProjectListPage;
