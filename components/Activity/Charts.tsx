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
import { i18n } from '../../models/Base/Translation';

type ActivityDataProps = {
  activityData: {
    keynoteSpeechCounts: { [key: string]: number };
    mentorOrganizationCounts: { [key: string]: number };
  };
};

const ActivityCharts: FC<ActivityDataProps> = observer(props => {
  const { t } = i18n;
  const keynoteSpeechList = Object.entries(
    props.activityData.keynoteSpeechCounts,
  ).sort((a, b) => b[1] - a[1]);

  const mentorOrganizationList = Object.entries(
    props.activityData.mentorOrganizationCounts,
  ).sort((a, b) => b[1] - a[1]);

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
        <Title>
          {t('distribution_of_mentor_organizations_by_contribution')}
        </Title>
        <XAxis
          type="category"
          data={mentorOrganizationList.map(([key]) => key)}
        />
        <YAxis type="value" />
        <BarSeries data={mentorOrganizationList.map(([{}, value]) => value)} />
        <Tooltip />
      </SVGCharts>
    </>
  );
});

export default ActivityCharts;