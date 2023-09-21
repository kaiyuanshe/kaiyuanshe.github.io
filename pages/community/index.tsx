import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import { CommunityListLayout } from '../../components/Community/List';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Community, CommunityModel } from '../../models/Community';

export const getServerSideProps = compose<{}, { list: Community[] }>(
  translator(i18n),
  async () => {
    const list = await new CommunityModel().getAll();
    return { props: { list: JSON.parse(JSON.stringify(list)) } };
  },
);

const { t } = i18n;

const CommunityListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => (
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
      {t('community_register')}
    </Button>
  </Container>
));

export default CommunityListPage;
