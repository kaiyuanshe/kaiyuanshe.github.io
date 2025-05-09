import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Breadcrumb, Button, Container } from 'react-bootstrap';

import { CommunityMemberList } from '../../components/Community/MemberList';
import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Base/Translation';
import { CommunityMember, CommunityMemberModel } from '../../models/Community/CommunityMember';

interface CommunityMemberListPageProps {
  list: CommunityMember[];
  community: string;
}

export const getServerSideProps = compose<{ community: string }, CommunityMemberListPageProps>(
  cache(),
  errorLogger,
  async ({ params: { community } = {} }) => {
    const list = await new CommunityMemberModel().getAll({ community });

    return { props: JSON.parse(JSON.stringify({ list, community })) };
  },
);

const CommunityMemberListPage: FC<CommunityMemberListPageProps> = observer(
  ({ list, community }) => {
    const { t } = useContext(I18nContext);

    return (
      <Container className="py-5">
        <PageHead title={textJoin(community, t('community'))} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/community">{t('community')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{community}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center">{textJoin(community, t('community'))}</h1>

        <section className="my-5 text-center">
          {list[0] ? (
            <>
              <h2 className="mb-5">{t('community_member')}</h2>
              <CommunityMemberList list={list} />
            </>
          ) : (
            <h2>{t('add_member')}</h2>
          )}
          <Button
            className="my-3"
            size="lg"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnogj5LPzlaiUkFaKpVbxNXe"
          >
            {t('KCC_member_registration')}
          </Button>
        </section>
      </Container>
    );
  },
);
export default CommunityMemberListPage;
