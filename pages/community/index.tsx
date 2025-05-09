import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';

import { CommunityListLayout } from '../../components/Community/List';
import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Base/Translation';
import { Community, CommunityModel } from '../../models/Community';

interface CommunityListPageProps {
  list: Community[];
}

export const getServerSideProps = compose<{}, CommunityListPageProps>(
  cache(),
  errorLogger,
  async () => {
    const list = await new CommunityModel().getAll();

    return { props: JSON.parse(JSON.stringify({ list })) };
  },
);

const CommunityListPage: FC<CommunityListPageProps> = observer(({ list }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-5 text-center">
      <PageHead title={t('community_list')} />
      <h1 className="mb-5 text-center">{t('community_list')}</h1>

      <CommunityListLayout defaultData={list} />
      <Button
        className="my-3"
        size="lg"
        target="_blank"
        href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnAyfE76AHnwtJ8P1fO7avaf"
      >
        {t('KCC_community_establishment_registration')}
      </Button>
    </Container>
  );
});
export default CommunityListPage;
