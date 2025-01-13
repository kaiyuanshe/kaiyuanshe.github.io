import { text2color } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { Component } from 'react';
import { Badge, Button, Nav } from 'react-bootstrap';
import { isEmpty } from 'web-utility';

import { i18n, t } from '../../models/Base/Translation';
import {
  OrganizationModel,
  OrganizationStatistic,
} from '../../models/Community/Organization';
import { CityStatisticMap } from '../Map/CityStatisticMap';
import { OrganizationCardProps } from './Card';
import { OrganizationListLayout } from './List';

const OrganizationCharts = dynamic(() => import('./Charts'), { ssr: false });

export interface OpenCollaborationMapProps extends OrganizationStatistic {
  store: OrganizationModel;
}

@observer
export class OpenCollaborationMap extends Component<OpenCollaborationMapProps> {
  @observable
  accessor tabKey: 'map' | 'chart' = 'map';

  switchFilter: Required<OrganizationCardProps>['onSwitch'] = ({
    type,
    tags,
    city,
  }) => {
    const { filter } = this.props.store;

    this.props.store.clear();

    return this.props.store.getList(
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
    const { filter, totalCount } = this.props.store;

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
    const { props, tabKey } = this;

    return (
      <div>
        <Nav
          variant="pills"
          className="justify-content-center mb-3"
          activeKey={tabKey}
          onSelect={key =>
            key && (this.tabKey = key as OpenCollaborationMap['tabKey'])
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
          <OrganizationCharts {...props} />
        ) : (
          <CityStatisticMap
            data={props.city}
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
          store={this.props.store}
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
