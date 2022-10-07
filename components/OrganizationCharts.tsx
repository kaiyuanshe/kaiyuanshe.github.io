import { Row } from 'react-bootstrap';
import {
  CanvasCharts,
  Title,
  Tooltip,
  XAxis,
  YAxis,
  BarSeries,
  PieSeries,
} from 'echarts-jsx';

import {
  OrganizationStatistic,
  sortStatistic,
} from '../pages/api/organization/statistic';

export default function OrganizationCharts({
  type,
  tag,
  year,
  city,
}: OrganizationStatistic) {
  const typeList = sortStatistic(type),
    tagList = sortStatistic(tag),
    yearList = sortStatistic(year, false).reverse(),
    cityList = sortStatistic(city);

  return (
    <div style={{ minHeight: '70vh' }}>
      <CanvasCharts>
        <Title>社区城市排行</Title>
        <XAxis type="category" data={cityList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={cityList.map(([{}, value]) => value)} />
        <Tooltip />
      </CanvasCharts>

      <CanvasCharts>
        <Title>社区领域排行</Title>
        <XAxis type="category" data={tagList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={tagList.map(([{}, value]) => value)} />
        <Tooltip />
      </CanvasCharts>

      <Row xs={1} sm={1} md={2}>
        <CanvasCharts className="col-auto">
          <Title>社区创始年表</Title>
          <XAxis type="category" data={yearList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={yearList.map(([{}, value]) => value)} />
          <Tooltip />
        </CanvasCharts>
        <CanvasCharts className="col-auto">
          <Title>社区类型分布</Title>
          <PieSeries
            data={typeList.map(([name, value]) => ({ name, value }))}
          />
          <Tooltip trigger="item" />
        </CanvasCharts>
      </Row>
    </div>
  );
}
