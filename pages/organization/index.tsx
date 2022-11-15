import { isEmpty } from 'web-utility';
import dynamic from 'next/dynamic';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Badge, Button, Nav } from 'react-bootstrap';
import { text2color } from 'idea-react';

import PageHead from '../../components/PageHead';
import { OrganizationCardProps } from '../../components/Organization/Card';
import { OrganizationList } from '../../components/Organization/List';
import { CityStatisticMap } from '../../components/CityStatisticMap';

import { isServer } from '../../models/Base';
import organizationStore from '../../models/Organization';

const OrganizationCharts = dynamic(
  () => import('../../components/Organization/Charts'),
  { ssr: false },
);

@observer
export class OpenSourceMap extends PureComponent {
  @observable
  tabKey: 'map' | 'chart' = 'map';

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
      <div>
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
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderTab()}

        {this.renderFilter()}

        <OrganizationList
          store={organizationStore}
          onSwitch={this.switchFilter}
        />
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
            <Button className="me-2" size="sm" href="/organization/landscape">
              全景图
            </Button>
            <Button
              variant="success"
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
