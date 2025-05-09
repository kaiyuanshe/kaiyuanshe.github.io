import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, errorLogger, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { ProposalListLayout } from '../../../components/Proposal/List';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import proposalStore, { Proposal, ProposalModel } from '../../../models/Governance/Proposal';

interface ProposalListProps extends RouteProps {
  list: Proposal[];
}

export const getServerSideProps = compose<{}, ProposalListProps>(
  router,
  errorLogger,
  async ({ query }) => {
    const list = await new ProposalModel().getList(query);

    return { props: JSON.parse(JSON.stringify(list)) as ProposalListProps };
  },
);

const ProposalPage: FC<ProposalListProps> = observer(({ route: { query }, list }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container>
      <PageHead title={t('proposal_library')} />

      <header className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">{t('proposal_library')}</h1>
        <div>
          <Button
            variant="success"
            size="sm"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnUPBMvqGeGJzWJ3JzUYsO4b"
          >
            {t('submit_proposal')}
          </Button>
        </div>
      </header>

      <ScrollList
        translator={i18n}
        store={proposalStore}
        filter={query}
        renderList={allItems => <ProposalListLayout defaultData={allItems as Proposal[]} />}
        defaultData={list}
      />
    </Container>
  );
});
export default ProposalPage;
