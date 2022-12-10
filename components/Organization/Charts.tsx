import { FC } from 'react';
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

import { i18n } from '../../models/Translation';
import {
  OrganizationStatistic,
  sortStatistic,
} from '../../pages/api/organization/statistic';

const OrganizationCharts: FC<OrganizationStatistic> = ({
  type,
  tag,
  year,
  city,
}) => {
  const { t } = i18n,
    typeList = sortStatistic(type),
    tagList = sortStatistic(tag),
    yearList = sortStatistic(year, false).reverse(),
    cityList = sortStatistic(city);

  return (
    <div style={{ minHeight: '70vh' }}>
      <SVGCharts>
        <Title>{t('community_city_ranking')}</Title>
        <XAxis type="category" data={cityList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={cityList.map(([{}, value]) => value)} />
        <Tooltip />
      </SVGCharts>

      <SVGCharts>
        <Title>{t('community_field_ranking')}</Title>
        <XAxis type="category" data={tagList.map(([key]) => key)} />
        <YAxis type="value" />
        <BarSeries data={tagList.map(([{}, value]) => value)} />
        <Tooltip />
      </SVGCharts>

      <Row xs={1} sm={1} md={2}>
        <SVGCharts className="col-auto">
          <Title>{t('community_founding_chronology')}</Title>
          <XAxis type="category" data={yearList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={yearList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>
        <SVGCharts className="col-auto">
          <Title>{t('community_type_distribution')}</Title>
          <PieSeries
            data={typeList.map(([name, value]) => ({ name, value }))}
          />
          <Tooltip trigger="item" />
        </SVGCharts>
      </Row>
    </div>
  );
};

export default OrganizationCharts;
