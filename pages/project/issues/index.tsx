import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container, Row } from 'react-bootstrap';

import { IssueModule } from '../../../components/Issues/IssueModule';
import PageHead from '../../../components/Layout/PageHead';
import { i18n } from '../../../models/Base/Translation';
import repositoryStore, { RepositoryModel } from '../../../models/Repository';

export const getServerSideProps = compose(translator(i18n), async () => {
  const list = await new RepositoryModel().getList();

  return { props: { list } };
});

const IssuesPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => (
    <Container className="py-5">
      <PageHead title="issues" />
      <h1>Issues</h1>

      {repositoryStore.downloading > 0 && <Loading />}

      <ScrollList
        translator={i18n}
        store={repositoryStore}
        defaultData={list}
        renderList={allItems => (
          <Row as="ul" className="list-unstyled g-4">
            {allItems.map(
              repository =>
                repository.issues[0] && (
                  <IssueModule key={repository.name} {...repository} />
                ),
            )}
          </Row>
        )}
      />
    </Container>
  ));

export default IssuesPage;
