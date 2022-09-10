import { isEmpty } from 'web-utility';
import { groupBy, debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import {
  text2color,
  ScrollBoundary,
  TouchHandler,
  Loading,
  OpenMapProps,
} from 'idea-react';

import PageHead from '../../components/PageHead';
import {
  OrganizationCardProps,
  OrganizationCard,
} from '../../components/OrganizationCard';
import { client } from '../../models/Base';
import organizationStore, { Organization } from '../../models/Organization';

const ChinaMap = dynamic(() => import('../../components/ChinaMap'), {
  ssr: false,
});

interface MapPoint {
  name: string;
  value: [number, number];
}

interface State {
  loading: boolean;
  currentCity?: string;
  list: MapPoint[];
  orgs: Organization[];
}

@observer
export class OpenSourceMap extends PureComponent<{}, State> {
  state: Readonly<State> = {
    loading: true,
    list: [],
    orgs: [],
  };

  async componentDidMount() {
    const [{ body: city_coordinates }, orgs] = await Promise.all([
      client.get<Record<string, [number, number]>>(
        'https://ideapp.dev/public-meta-data/china-city-coordinate.json',
      ),
      organizationStore.getList(),
    ]);

    const list = Object.entries(groupBy(orgs, 'city'))
      .map(([city, list]) => {
        const point = city_coordinates![city! as string];

        if (point)
          return {
            name: `${city} ${list.length}`,
            value: [point[1], point[0]],
          };
      })
      .filter(Boolean) as State['list'];

    this.setState({ loading: false, list, orgs });
  }

  componentWillUnmount() {
    organizationStore.clear();
  }

  loadMore: TouchHandler = debounce(edge => {
    const { downloading, noMore } = organizationStore;

    if (edge === 'bottom' && !downloading && !noMore)
      organizationStore.getList();
  });

  switchFilter: OrganizationCardProps['onSwitch'] = ({ type, tag }) => {
    const { filter } = organizationStore;

    organizationStore.clear();

    organizationStore.getList(
      type ? { ...filter, type } : tag ? { ...filter, tags: tag && [tag] } : {},
    );
  };

  switchCity: OpenMapProps['onMarkerClick'] = ({ latlng: { lat, lng } }) => {
    const { list } = this.state;
    const { name } =
      list.find(
        ({ value: [latitude, longitude] }) =>
          lat === latitude && lng === longitude,
      ) || {};
    const [city] = name?.split(/\s+/) || [];

    console.log(city);
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
            onClick={() => this.switchFilter!({})}
          >
            重置
          </Button>
        </header>
      )
    );
  }

  render() {
    const { currentCity, list } = this.state;
    const { downloading, allItems } = organizationStore;

    return (
      <>
        {downloading ? (
          <Loading />
        ) : (
          <div style={{ height: '70vh' }}>
            <ChinaMap
              markers={list.map(({ name, value }) => ({
                position: value,
                tooltip: name,
              }))}
              onMarkerClick={this.switchCity}
            />
          </div>
        )}
        <ScrollBoundary onTouch={this.loadMore}>
          {this.renderFilter()}

          <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-2">
            {allItems.map(
              ({ id, ...org }) =>
                (!currentCity || currentCity === org.city) && (
                  <Col key={org.name as string}>
                    <OrganizationCard
                      className="h-100"
                      {...org}
                      onSwitch={this.switchFilter}
                    />
                  </Col>
                ),
            )}
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
