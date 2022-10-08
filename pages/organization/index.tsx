import { isEmpty } from 'web-utility';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col, Badge, Button, Nav } from 'react-bootstrap';
import { text2color, ScrollBoundary, TouchHandler, Loading } from 'idea-react';

import PageHead from '../../components/PageHead';
import {
  OrganizationCardProps,
  OrganizationCard,
} from '../../components/OrganizationCard';
import { CityStatisticMap } from '../../components/CityStatisticMap';

import { isServer } from '../../models/Base';
import organizationStore from '../../models/Organization';

const OrganizationCharts = dynamic(
  () => import('../../components/OrganizationCharts'),
  { ssr: false },
);

@observer
export class OpenSourceMap extends PureComponent {
  @observable
  tabKey: 'map' | 'chart' = 'map';

  componentDidMount() {
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

  renderTab() {
    const { tabKey } = this,
      { statistic } = organizationStore;

    return (
      <>
        <Nav
          variant="pills"
          className="justify-content-center mb-3"
          activeKey={tabKey}
          onSelect={key =>
            key && (this.tabKey = key as OpenSourceMap['tabKey'])
          }
        >
          <Nav.Item>
            <Nav.Link eventKey="map">地图</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chart">图表</Nav.Link>
          </Nav.Item>
        </Nav>

        {tabKey !== 'map' ? (
          <OrganizationCharts {...statistic} />
        ) : (
          !isServer() && (
            <CityStatisticMap
              store={organizationStore}
              onChange={city => this.switchFilter({ city })}
            />
          )
        )}
      </>
    );
  }

  render() {
    const { downloading, allItems } = organizationStore;

    return (
      <>
        {downloading > 0 ? <Loading /> : this.renderTab()}

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
