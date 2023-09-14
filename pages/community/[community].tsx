import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

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
    const list = await new CommunityMemberModel().getList({ community });
    return { props: JSON.parse(JSON.stringify({ list, community })) };
  },
);

@observer
export default class CommunityMemberListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { list, community } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={`${community}社区`} />
        {list[0] ? (
          <>
            <h1 className="mb-5 text-center">{t('community_member')}</h1>
            <CommunityMemberList list={list} />
          </>
        ) : (
          <h2 className="my-5 text-center">{t('add_member')}</h2>
        )}
      </Container>
    );
  }
}
