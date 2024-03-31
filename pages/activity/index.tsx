import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { ActivityListLayout } from '../../components/Activity/List';
import PageHead from '../../components/Layout/PageHead';
import activityStore, { Activity, ActivityModel } from '../../models/Activity';
import { i18n } from '../../models/Base/Translation';

export const getServerSideProps = compose<{}, { list: Activity[] }>(
  translator(i18n),
  async () => {
    const list = await new ActivityModel().getList();

    return { props: { list: JSON.parse(JSON.stringify(list)) } };
  },
);

const { t } = i18n;

const ActivityListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => (
  <Container className="py-5">
    <PageHead title={t('highlight_events')} />

    <h1 className="mb-5 text-center">{t('highlight_events')}</h1>

    <ScrollList
      translator={i18n}
      store={activityStore}
      renderList={allItems => <ActivityListLayout defaultData={allItems} />}
      defaultData={list}
    />
  </Container>
));

export default ActivityListPage;
