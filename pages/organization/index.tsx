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

import organizationStore from '../../models/Organization';
import { i18n } from '../../models/Translation';

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
            {i18n.t('filter')}
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
          {i18n.t('altogether')} {totalCount} {i18n.t('companies')}
          <Button
            variant="warning"
            size="sm"
            onClick={() => this.switchFilter({})}
          >
            {i18n.t('reset')}
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
            <Nav.Link eventKey="map">{i18n.t('map')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chart">{i18n.t('chart')}</Nav.Link>
          </Nav.Item>
        </Nav>

        {tabKey !== 'map' ? (
          <OrganizationCharts {...statistic} />
        ) : (
          <CityStatisticMap
            store={organizationStore}
            onChange={city => this.switchFilter({ city })}
          />
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
      <PageHead title={i18n.t('open_source_map')} />

      <Container>
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">{i18n.t('china_open_source_map')}</h1>
          <div>
            <Button className="me-2" size="sm" href="/organization/landscape">
              {i18n.t('panorama')}
            </Button>
            <Button
              variant="success"
              size="sm"
              target="_blank"
              href="https://kaiyuanshe.feishu.cn/share/base/shrcnPgQoUZzkpWB2W4dp2QQvbd"
            >
              {i18n.t('join_the_open_source_map')}
            </Button>
          </div>
        </header>

        <OpenSourceMap />
      </Container>
    </>
  );
}
