import { text2color } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { Badge, Button, Nav } from 'react-bootstrap';
import { isEmpty } from 'web-utility';

import { i18n } from '../../models/Base/Translation';
import organizationStore, {
  OrganizationModel,
} from '../../models/Community/Organization';
import { CityStatisticMap } from '../Map/CityStatisticMap';
import { OrganizationCardProps } from './Card';
import { OrganizationListLayout } from './List';

const OrganizationCharts = dynamic(() => import('./Charts'), { ssr: false }),
  { t } = i18n;

@observer
export class OpenSourceMap extends PureComponent {
  constructor(props: {}) {
    super(props);
    makeObservable(this);
  }

  listStore = new OrganizationModel();

  @observable
  tabKey: 'map' | 'chart' = 'map';

  switchFilter: Required<OrganizationCardProps>['onSwitch'] = ({
    type,
    tags,
    city,
  }) => {
    const { filter } = this.listStore;

    this.listStore.clear();

    return this.listStore.getList(
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
    const { filter, totalCount } = this.listStore;

    return (
      !isEmpty(filter) && (
        <header
          className="d-flex justify-content-between align-items-center sticky-top bg-white py-3"
          style={{ top: '5rem' }}
        >
          <div>
            {t('filter')}
            {Object.entries(filter).map(([key, value]) => (
              <Badge
                key={key}
                className="mx-2"
                bg={text2color(value + '', ['light'])}
              >
                {value + ''}
              </Badge>
            ))}
          </div>
          {t('total_x_organizations', { totalCount })}
          <Button
            variant="warning"
            size="sm"
            onClick={() => this.switchFilter({})}
          >
            {t('reset')}
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
            <Nav.Link eventKey="map">{t('map')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chart">{t('chart')}</Nav.Link>
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

        <ScrollList
          translator={i18n}
          store={this.listStore}
          renderList={allItems => (
            <OrganizationListLayout
              defaultData={allItems}
              onSwitch={this.switchFilter}
            />
          )}
        />
      </>
    );
  }
}
