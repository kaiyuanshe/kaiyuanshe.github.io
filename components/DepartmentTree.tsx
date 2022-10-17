import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Loading } from 'idea-react';
import { SVGCharts, Tooltip, TreeSeriesProps, TreeSeries } from 'echarts-jsx';

import { fileURLOf } from '../pages/api/lark/file/[id]';
import groupStore from '../models/Group';

@observer
export default class DepartmentTree extends PureComponent {
  componentDidMount() {
    groupStore.getAll();
  }

  @computed
  get treeData(): TreeSeriesProps['data'] {
    const { 职能: departments, 项目: projects } = groupBy(
      groupStore.allItems,
      'type',
    );

    return [
      {
        name: '开源社',
        children: [
          {
            name: '理事会',
            children: [
              {
                name: '执行委员会',
                collapsed: false,
                children: departments?.map(({ name }) => ({ name: name + '' })),
              },
              {
                name: '项目委员会',
                collapsed: false,
                children: projects?.map(({ fullName }) => ({
                  name: fullName + '',
                })),
              },
            ],
          },
          { name: '顾问委员会' },
          { name: '法律咨询委员会' },
        ],
      },
    ];
  }

  renderGroup(name: string) {
    const { logo, summary } =
      groupStore.allItems.find(
        ({ name: n, fullName }) => n === name || fullName === name,
      ) || {};

    return !summary ? (
      <></>
    ) : (
      <div className="text-center">
        <h3 className="h5 mb-3">{name}</h3>
        {logo && (
          <img
            className="mb-3"
            style={{ maxWidth: '10rem' }}
            src={fileURLOf(logo)}
          />
        )}
        <p className="m-0 text-wrap" style={{ maxWidth: '50vw' }}>
          {summary}
        </p>
      </div>
    );
  }

  render() {
    const { downloading } = groupStore;

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
              formatter: ({ name }) =>
                renderToStaticMarkup(this.renderGroup(name)),
            }}
            data={this.treeData}
          />
        </SVGCharts>
      </>
    );
  }
}
