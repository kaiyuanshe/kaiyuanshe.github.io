import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container, Row } from 'react-bootstrap';

import PageHead from '../../../components/PageHead';
import { i18n } from '../../../models/Base/Translation';
import repositoryStore, { RepositoryModel } from '../../../models/Repository';

const IssueModule = dynamic(
  () => import('../../../components/Issues/IssueModule'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n), async () => {
  const list = await new RepositoryModel().getList();
  return { props: { list } };
});

const IssuesPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => {
    return (
      <Container className="py-5">
        <PageHead title="issues" />

        {repositoryStore.downloading > 0 && <Loading />}

        <ScrollList
          translator={i18n}
          store={repositoryStore}
          defaultData={list}
          renderList={allItems => (
            <Row as="ul" className="list-unstyled g-4">
              {allItems.map(({ name, issues }) => (
                <IssueModule
                  key={name}
                  title={name}
                  issues={issues}
                ></IssueModule>
              ))}
            </Row>
          )}
        />
      </Container>
    );
  });

export default IssuesPage;
