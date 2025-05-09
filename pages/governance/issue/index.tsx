import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, errorLogger, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { IssueListLayout } from '../../../components/Issue/List';
import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import issueStore, { Issue, IssueModel } from '../../../models/Governance/Issue';

interface IssuePageProps extends RouteProps {
  list: Issue[];
}

export const getServerSideProps = compose<{}, IssuePageProps>(
  router,
  errorLogger,
  async ({ query }) => {
    const list = await new IssueModel().getList(query);

    return { props: JSON.parse(JSON.stringify({ list })) as IssuePageProps };
  },
);

const IssuePage: FC<IssuePageProps> = observer(({ route: { query }, list }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('issue_box')} />
      <header className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">{t('issue_box')}</h1>
        <div>
          <Button
            variant="success"
            size="sm"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcn6Yd39PMtEbIaT4uiliAeJF"
          >
            {t('submit_issue')}
          </Button>
        </div>
      </header>
      <ScrollList
        translator={i18n}
        store={issueStore}
        filter={query}
        renderList={allItems => <IssueListLayout defaultData={allItems} />}
        defaultData={list}
      />
    </Container>
  );
});
export default IssuePage;
