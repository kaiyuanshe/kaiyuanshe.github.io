import {
  BarSeries,
  PieSeries,
  SVGCharts,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from 'echarts-jsx';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Row } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import {
  OrganizationStatistic,
  sortStatistic,
} from '../../models/Community/Organization';

const OrganizationCharts: FC<OrganizationStatistic> = observer(
  ({ type, tag, year, city }) => {
    const typeList = sortStatistic(type),
      tagList = sortStatistic(tag),
      yearList = sortStatistic(year, false).reverse(),
      cityList = sortStatistic(city);

    return (
      <div style={{ minHeight: '70vh' }}>
        <SVGCharts>
          <Title>{t('distribution_of_communities_by_city')}</Title>
          <XAxis type="category" data={cityList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={cityList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <SVGCharts>
          <Title>{t('distribution_of_communities_by_technology')}</Title>
          <XAxis type="category" data={tagList.map(([key]) => key)} />
          <YAxis type="value" />
          <BarSeries data={tagList.map(([{}, value]) => value)} />
          <Tooltip />
        </SVGCharts>

        <Row xs={1} sm={1} md={2}>
          <SVGCharts className="col-auto">
            <Title>{t('distribution_of_communities_by_founding_year')}</Title>
            <XAxis type="category" data={yearList.map(([key]) => key)} />
            <YAxis type="value" />
            <BarSeries data={yearList.map(([{}, value]) => value)} />
            <Tooltip />
          </SVGCharts>
          <SVGCharts className="col-auto">
            <Title>{t('distribution_of_communities_by_type')}</Title>
            <PieSeries
              data={typeList.map(([name, value]) => ({ name, value }))}
            />
            <Tooltip trigger="item" />
          </SVGCharts>
        </Row>
      </div>
    );
  },
);

export default OrganizationCharts;
