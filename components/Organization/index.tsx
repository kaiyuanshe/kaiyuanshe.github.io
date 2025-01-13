import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { Component } from 'react';
import { Accordion, Button, Nav } from 'react-bootstrap';
import { sum } from 'web-utility';

import { i18n, t } from '../../models/Base/Translation';
import {
  OrganizationModel,
  OrganizationStatistic,
} from '../../models/Community/Organization';
import { TagNav } from '../Base/TagNav';
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
    const { type, tag } = this.props,
      { filter, totalCount } = this.props.store;
    const count =
      totalCount != null && totalCount !== Infinity
        ? totalCount
        : (type[filter.type + ''] ??
          tag[filter.tags + ''] ??
          sum(...Object.values(type)));

    return (
      <Accordion
        as="header"
        className="sticky-top bg-white"
        style={{ top: '5rem' }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="w-100 d-flex justify-content-between align-items-center">
              {t('filter')}

              <TagNav list={Object.values(filter) as string[]} />

              {t('total_x_organizations', { totalCount: count })}
            </div>
          </Accordion.Header>
          <Accordion.Body as="form" onReset={() => this.switchFilter({})}>
            <fieldset className="mb-3">
              <legend>{t('type')}</legend>

              <TagNav
                list={Object.keys(type)}
                onCheck={type => this.switchFilter({ type })}
              />
            </fieldset>
            <fieldset className="mb-3">
              <legend>{t('tag')}</legend>

              <TagNav
                list={Object.keys(tag)}
                onCheck={tags => this.switchFilter({ tags })}
              />
            </fieldset>
            <Button type="reset" variant="warning" size="sm">
              {t('reset')}
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
