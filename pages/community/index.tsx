import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { CommunityListLayout } from '../../components/Community/CommunityList';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Community, CommunityModel } from '../../models/Community';

export const getServerSideProps = compose<{}, { list: Community[] }>(
  translator(i18n),
  async () => {
    const list = await new CommunityModel().getList();
    return { props: { list: JSON.parse(JSON.stringify(list)) } };
  },
);

const { t } = i18n;

const CommunityListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => (
  <Container className="py-5">
    <PageHead title={t('community_list')} />
    <h1 className="mb-5 text-center">{t('community_list')}</h1>
    <CommunityListLayout list={list} />
  </Container>
));

export default CommunityListPage;
