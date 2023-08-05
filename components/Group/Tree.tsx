import { SVGCharts, Tooltip, TreeSeries } from 'echarts-jsx';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { DepartmentModel, DepartmentNode } from '../../models/Group';
import { GroupCard } from './Card';

@observer
export default class DepartmentTree extends PureComponent {
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

  jumpLink({ name, superior }: DepartmentNode) {
    if (name === '理事会') {
      location.href = '/department/council';
    } else if (name === '顾问委员会') {
      location.href = '/department/committee/consultant';
    } else if (name === '法律咨询委员会') {
      location.href = '/department/committee/legal-advisory';
    } else if (['执行委员会', '项目委员会'].includes(superior))
      location.href = `/member#${name}`;
  }

  render() {
    const { downloading, tree } = this.store;

    return (
      <>
        {downloading > 0 && <Loading />}

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
