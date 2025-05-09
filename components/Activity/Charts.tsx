import { BarSeries, SVGCharts, Title, Tooltip, XAxis, YAxis } from 'echarts-jsx';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';

import { AgendaModel } from '../../models/Activity/Agenda';
import { I18nContext } from '../../models/Base/Translation';

type ActivityDataProps = Awaited<ReturnType<AgendaModel['getStatistics']>>;

const ActivityCharts: FC<ActivityDataProps> = observer(
  ({ keynoteSpeechCounts, mentorOrganizationCounts }) => {
    const { t } = useContext(I18nContext);

    const keynoteSpeechList = Object.entries(keynoteSpeechCounts).sort((a, b) => b[1] - a[1]),
      mentorOrganizationList = Object.entries(mentorOrganizationCounts).sort((a, b) => b[1] - a[1]);

    return (
      <>
        <SVGCharts>
          <Title>{t('distribution_of_activity_topics_by_heat')}</Title>
          <XAxis type="category" data={keynoteSpeechList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={keynoteSpeechList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts>
          <Title>{t('distribution_of_mentor_organizations_by_topics')}</Title>
          <XAxis type="category" data={mentorOrganizationList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={mentorOrganizationList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>
      </>
    );
  },
);
export default ActivityCharts;
