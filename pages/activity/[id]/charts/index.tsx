import { FC } from 'react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import dynamic from 'next/dynamic';

import { i18n } from '../../../../models/Base/Translation';
import { ActivityModel } from '../../../../models/Activity';

const ActivityCharts = dynamic(
  () => import('../../../../components/Activity/Charts'),
  { ssr: false },
);

type ActivityDataProps = {
  keynoteSpeechCounts: Record<string, number>;
  mentorOrganizationCounts: Record<string, number>;
};

export const getServerSideProps = compose(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const activityStore = new ActivityModel();
    await activityStore.getOne(params!.id, true);

    const { keynoteSpeechCounts, mentorOrganizationCounts } =
      await activityStore.currentAgenda!.getStatistics();

    return {
      props: { keynoteSpeechCounts, mentorOrganizationCounts },
    };
  },
);

const Charts: FC<ActivityDataProps> = props => <ActivityCharts {...props} />;

export default Charts;
