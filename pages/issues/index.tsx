import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import repositoryStore, { RepositoryModel } from '../../models/Repository';
import { i18n } from '../../models/Translation';

const { t } = i18n;

const IssueModule = dynamic(
  () => import('../../components/Issues/IssueModule'),
  { ssr: false },
);

export const getServerSideProps = compose(translator(i18n), async () => {
  const list = await new RepositoryModel().getList();
  console.log('list====', list);
  return { props: { list } };
});

const IssuesPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => {
    return (
      <Container>
        <PageHead title={t('issues')}></PageHead>

        {
          // list.map(item => <IssueModule title={item.name} issue={item}></IssueModule>)
        }
      </Container>
    );
  });

export default IssuesPage;
