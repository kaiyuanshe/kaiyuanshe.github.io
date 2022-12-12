import { observer } from 'mobx-react';
import { FC } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { ActivityList } from '../../components/Activity/List';
import activityStore from '../../models/Activity';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

export const getServerSideProps = withTranslation(async () => {
  const list = await activityStore.getList({}, 1);

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

      <ActivityList defaultData={list} />
    </Container>
  );
});

export default ActivityListPage;
