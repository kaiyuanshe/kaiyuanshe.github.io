import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';

import { PageHead } from '../../../../components/Layout/PageHead';
import { ActivityModel } from '../../../../models/Activity';
import { AgendaModel } from '../../../../models/Activity/Agenda';
import { i18n, t } from '../../../../models/Base/Translation';

const ActivityCharts = dynamic(
  () => import('../../../../components/Activity/Charts'),
  { ssr: false },
);

type ActivityDataProps = Awaited<ReturnType<AgendaModel['getStatistics']>>;

export const getServerSideProps = compose(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const activityStore = new ActivityModel();
    await activityStore.getOne(params!.id, true);

    const props = await activityStore.currentAgenda!.getStatistics();

    return { props };
  },
);

const Charts: FC<ActivityDataProps> = observer(props => (
  <main className="mt-2">
    <PageHead title={t('activity_statistics')} />
    <h1 className="mt-5 text-center">{t('activity_statistics')}</h1>
    <ActivityCharts {...props} />;
  </main>
));

export default Charts;
