import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Button, Container } from 'react-bootstrap';

import { CommunityMemberList } from '../../components/Community/MemberList';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import {
  CommunityMember,
  CommunityMemberModel,
} from '../../models/Community/CommunityMember';

const { t } = i18n;

export const getServerSideProps = compose<
  { community: string },
  {
    list: CommunityMember[];
    community: string;
  }
>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { community } = {} }) => {
    const list = await new CommunityMemberModel().getAll({ community });

    return { props: JSON.parse(JSON.stringify({ list, community })) };
  },
);

const CommunityMemberListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list, community }) => (
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
));

export default CommunityMemberListPage;
