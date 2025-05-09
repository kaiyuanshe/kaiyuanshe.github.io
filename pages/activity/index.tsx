import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { ActivityListLayout } from '../../components/Activity/List';
import { PageHead } from '../../components/Layout/PageHead';
import activityStore, { Activity, ActivityModel } from '../../models/Activity';
import { I18nContext } from '../../models/Base/Translation';

interface ActivityListPageProps {
  list: Activity[];
}

export const getServerSideProps = compose<{}, ActivityListPageProps>(async () => {
  const list = await new ActivityModel().getList();

  return { props: { list: JSON.parse(JSON.stringify(list)) } };
});

const ActivityListPage: FC<ActivityListPageProps> = observer(({ list }) => {
  const i18n = useContext(I18nContext);

  return (
    <Container className="py-5">
      <PageHead title={i18n.t('highlight_events')} />

      <h1 className="mb-5 text-center">{i18n.t('highlight_events')}</h1>

      <ScrollList
        translator={i18n}
        store={activityStore}
        renderList={allItems => <ActivityListLayout defaultData={allItems} />}
        defaultData={list}
      />
    </Container>
  );
});
export default ActivityListPage;
