import { SVGCharts, Tooltip, TreeSeries } from 'echarts-jsx';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Form } from 'react-bootstrap';
import { renderToStaticMarkup } from 'react-dom/server';

import { t } from '../../models/Base/Translation';
import {
  DepartmentModel,
  DepartmentNode,
} from '../../models/Personnel/Department';
import { GroupCard } from './Card';

@observer
export default class DepartmentTree extends Component {
  store = new DepartmentModel();

  componentDidMount() {
    this.store.getAll();
  }

  renderGroup(name: string) {
    const group = this.store.allItems.find(({ name: n }) => n === name);

    return renderToStaticMarkup(
      group?.summary ? <GroupCard {...group} /> : <></>,
    );
  }

  jumpLink({ name }: DepartmentNode) {
    if (name === '理事会') {
      location.href = '/department/board-of-directors';
    } else if (name === '顾问委员会') {
      location.href = '/department/committee/advisory';
    } else if (name === '法律咨询委员会') {
      location.href = '/department/committee/legal-advisory';
    } else {
      location.href = `/department/${name}`;
    }
  }

  render() {
    const { downloading, activeShown, tree } = this.store;

    return (
      <>
        {downloading > 0 && <Loading />}

        <label className="d-flex justify-content-center gap-3">
          {t('show_active_departments')}
          <Form.Switch
            checked={activeShown}
            onChange={this.store.toggleActive}
          />
        </label>

        <SVGCharts style={{ height: '80vh' }}>
          <Tooltip trigger="item" triggerOn="mousemove" />

          <TreeSeries
            label={{
              position: 'left',
              verticalAlign: 'middle',
              fontSize: 16,
            }}
            tooltip={{
              formatter: ({ name }) => this.renderGroup(name),
            }}
            data={[tree]}
            onClick={({ data }) => this.jumpLink(data as DepartmentNode)}
          />
        </SVGCharts>
      </>
    );
  }
}
