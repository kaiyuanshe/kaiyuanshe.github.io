import { Row } from 'react-bootstrap';
import {
  SVGCharts,
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
} from '../../pages/api/organization/statistic';
import { i18n } from '../../models/Translation';

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
      <SVGCharts>
        <Title>{i18n.t('community_city_ranking')}</Title>
        <XAxis type="category" data={cityList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={cityList.map(([{}, value]) => value)} />
        <Tooltip />
      </SVGCharts>

      <SVGCharts>
        <Title>{i18n.t('community_field_ranking')}</Title>
        <XAxis type="category" data={tagList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={tagList.map(([{}, value]) => value)} />
        <Tooltip />
      </SVGCharts>

      <Row xs={1} sm={1} md={2}>
        <SVGCharts className="col-auto">
          <Title>{i18n.t('community_founding_chronology')}</Title>
          <XAxis type="category" data={yearList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={yearList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>
        <SVGCharts className="col-auto">
          <Title>{i18n.t('community_type_distribution')}</Title>
          <PieSeries
            data={typeList.map(([name, value]) => ({ name, value }))}
          />
          <Tooltip trigger="item" />
        </SVGCharts>
      </Row>
    </div>
  );
}
