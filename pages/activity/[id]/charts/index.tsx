import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  BarSeries,
  SVGCharts,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from 'echarts-jsx';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';

import { i18n } from '../../../../models/Base/Translation';
import { ActivityModel } from '../../../../models/Activity';
import { processAgendaData } from '../../../../models/Activity/AgendaUtils';
import dynamic from 'next/dynamic';

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

    const agendaGroup = await activityStore.currentAgenda!.getGroup();
    const { keynoteSpeechCounts, mentorOrganizationCounts } =
      processAgendaData(agendaGroup);

    return {
      props: { keynoteSpeechCounts, mentorOrganizationCounts },
    };
  },
);

const Charts: FC<ActivityDataProps> = observer(props => {
  const { keynoteSpeechCounts, mentorOrganizationCounts } = props;

  return (
    <ActivityCharts
      keynoteSpeechCounts={keynoteSpeechCounts}
      mentorOrganizationCounts={mentorOrganizationCounts}
    />
  );
});

export default Charts;
