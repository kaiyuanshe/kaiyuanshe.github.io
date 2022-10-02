import { isEmpty } from 'web-utility';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import {
  text2color,
  ScrollBoundary,
  TouchHandler,
  Loading,
  MarkerMeta,
  OpenMapProps,
  OpenMap,
} from 'idea-react';

import PageHead from '../../components/PageHead';
import {
  OrganizationCardProps,
  OrganizationCard,
} from '../../components/OrganizationCard';

import { isServer } from '../../models/Base';
import metaStore from '../../models/Meta';
import { organizationStore } from '../../models/Organization';

@observer
export class OpenSourceMap extends PureComponent {
  @computed
  get markers() {
    const { cityCoordinate } = metaStore,
      { city = {} } = organizationStore.statistic;

    return Object.entries(city)
      .map(([city, count]) => {
        const point = cityCoordinate[city];

        if (point)
          return {
            tooltip: `${city} ${count}`,
            position: [point[1], point[0]],
          };
      })
      .filter(Boolean) as MarkerMeta[];
  }

  componentDidMount() {
    metaStore.getCityCoordinate();
    organizationStore.getStatistic();
    organizationStore.getList();
  }

  componentWillUnmount() {
    organizationStore.clear();
  }

  loadMore: TouchHandler = debounce(edge => {
    const { downloading, noMore } = organizationStore;

    if (edge === 'bottom' && !downloading && !noMore)
      organizationStore.getList();
  });

  switchFilter: Required<OrganizationCardProps>['onSwitch'] = ({
    type,
    tags,
    city,
  }) => {
    const { filter } = organizationStore;

    organizationStore.clear();

    return organizationStore.getList(
      type
        ? { ...filter, type }
        : tags
        ? { ...filter, tags }
        : city
        ? { city }
        : {},
    );
  };

  switchCity: OpenMapProps['onMarkerClick'] = ({ latlng: { lat, lng } }) => {
    const { markers } = this;
    const { tooltip } =
      markers.find(
        ({ position: p }) => p instanceof Array && lat === p[0] && lng === p[1],
      ) || {};
    const [city] = tooltip?.split(/\s+/) || [];

    return this.switchFilter({ city });
  };

  renderFilter() {
    const { filter, totalCount } = organizationStore;

    return (
      !isEmpty(filter) && (
        <header
          className="d-flex justify-content-between align-items-center sticky-top bg-white py-3"
          style={{ top: '5rem' }}
        >
          <div>
            筛选
            {Object.entries(filter).map(([key, value]) => (
              <Badge
                key={key}
                className="mx-2"
                bg={text2color(value + '', ['light'])}
              >
                {value}
              </Badge>
            ))}
          </div>
          共 {totalCount} 家
          <Button
            variant="warning"
            size="sm"
            onClick={() => this.switchFilter({})}
          >
            重置
          </Button>
        </header>
      )
    );
  }

  render() {
    const { markers } = this;
    const { downloading, allItems } = organizationStore;

    return (
      <>
        {downloading ? (
          <Loading />
        ) : (
          <div style={{ height: '70vh' }}>
            {!isServer() && (
              <OpenMap
                center={[34.32, 108.55]}
                zoom={4}
                markers={markers}
                onMarkerClick={this.switchCity}
              />
            )}
          </div>
        )}
        <ScrollBoundary onTouch={this.loadMore}>
          {this.renderFilter()}

          <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-2">
            {allItems.map(({ id, ...org }) => (
              <Col key={org.name as string}>
                <OrganizationCard
                  className="h-100"
                  {...org}
                  onSwitch={this.switchFilter}
                />
              </Col>
            ))}
          </Row>
        </ScrollBoundary>
      </>
    );
  }
}

export default function OrganizationPage() {
  return (
    <>
      <PageHead title="开源地图" />

      <Container>
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">中国开源地图</h1>
          <div>
            <Button
              size="sm"
              target="_blank"
              href="https://kaiyuanshe.feishu.cn/share/base/shrcnPgQoUZzkpWB2W4dp2QQvbd"
            >
              + 加入开源地图
            </Button>
          </div>
        </header>

        <OpenSourceMap />
      </Container>
    </>
  );
}
