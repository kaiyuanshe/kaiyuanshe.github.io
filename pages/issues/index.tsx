import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC, useEffect } from 'react';
import { Col,Container, Row } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import repositoryStore, { RepositoryModel } from '../../models/Repository';
import { i18n } from '../../models/Translation';

const { t } = i18n;

const IssueModule = dynamic(
  () => import('../../components/Issues/IssueModule'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n), async () => {
  let list: any = [];
  list = await new RepositoryModel().getList();
  console.log('list====', list);
  return { props: { list } };
});

const IssuesPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => {
    const testList = [
      {
        name: '123124',
        issues: [
          {
            title: 'dsad',
            body: 'asd809d',
          },
        ],
      },
      {
        name: '12312324',
        issues: [
          {
            title: 'dsad',
            body: 'assd',
          },
        ],
      },
      {
        name: '12312124',
        issues: [
          {
            title: 'dsad',
            body: 'asd09sd',
          },
        ],
      },
    ];
    return (
      <Container className="py-5">
        <PageHead title={t('issues')}></PageHead>

        {repositoryStore.downloading > 0 && <Loading />}

        <ScrollList
          translator={i18n}
          store={repositoryStore}
          defaultData={list}
          renderList={allItems => {
            console.log('allItems====', allItems);
            return (
              <Row as="ul" className="list-unstyled g-4">
                {allItems.map(item => (
                  <IssueModule
                    key={item.name}
                    title={item.name}
                    issues={item.issues}
                  ></IssueModule>
                ))}
              </Row>
            );
          }}
        ></ScrollList>
      </Container>
    );
  });

export default IssuesPage;
