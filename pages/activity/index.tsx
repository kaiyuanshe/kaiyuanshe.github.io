import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { ActivityListLayout } from '../../components/Activity/List';
import PageHead from '../../components/PageHead';
import activityStore, { ActivityModel } from '../../models/Activity';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

export const getServerSideProps = withTranslation(async () => {
  const list = await new ActivityModel().getList();

  return { props: { list: JSON.parse(JSON.stringify(list)) } };
});

const ActivityListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => {
  const { t } = i18n;

  return (
    <Container className="py-5">
      <PageHead title={t('wonderful_activity')} />

      <h1 className="mb-5 text-center">{t('wonderful_activity')}</h1>

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
