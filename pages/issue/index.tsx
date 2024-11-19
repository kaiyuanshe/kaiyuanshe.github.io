import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { SearchBar } from '../../components/Base/SearchBar';
import { IssueListLayout } from '../../components/Issue/List';
import { PageHead } from '../../components/Layout/PageHead';
import { i18n, t } from '../../models/Base/Translation';
import issueStore, { Issue, IssueModel } from '../../models/Governance/Issue';

interface IssuePageProps extends RouteProps {
  list: Issue[];
}

export const getServerSideProps = compose<{}, IssuePageProps>(
  router,
  errorLogger,
  translator(i18n),
  async ({ query }) => {
    const list = await new IssueModel().getList(query);
    return { props: { list } as IssuePageProps };
  },
);

const IssuePage: FC<IssuePageProps> = observer(({ route: { query }, list }) => (
  <Container>
    <PageHead title={t('issue')} />

    <header className="d-flex flex-wrap justify-content-around align-items-center my-4">
      <h1 className="my-4">{t('issue')}</h1>
      <SearchBar action="/search/issue" />
    </header>
    <ScrollList
      translator={i18n}
      store={issueStore}
      filter={query}
      renderList={allItems => <IssueListLayout defaultData={allItems} />}
      defaultData={list}
    />
  </Container>
));
