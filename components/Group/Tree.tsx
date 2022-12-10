import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Loading } from 'idea-react';
import { SVGCharts, Tooltip, TreeSeriesProps, TreeSeries } from 'echarts-jsx';

import { GroupCard } from './Card';
import groupStore from '../../models/Group';
import { i18n } from '../../models/Translation';

@observer
export default class DepartmentTree extends PureComponent {
  componentDidMount() {
    groupStore.getAll();
  }

  @computed
  get treeData(): TreeSeriesProps['data'] {
    const { t } = i18n,
      { 职能: departments, 项目: projects } = groupBy(
        groupStore.allItems,
        'type',
      );

    return [
      {
        name: t('open_source_community'),
        children: [
          {
            name: t('council'),
            children: [
              {
                name: t('executive_committee'),
                collapsed: false,
                children: departments?.map(({ name }) => ({ name: name + '' })),
              },
              {
                name: t('project_committee'),
                collapsed: false,
                children: projects?.map(({ fullName }) => ({
                  name: fullName + '',
                })),
              },
            ],
          },
          { name: t('consultant_committee') },
          { name: t('legal_advisory_committee') },
        ],
      },
    ];
  }

  renderGroup(name: string) {
    const group = groupStore.allItems.find(
      ({ name: n, fullName }) => n === name || fullName === name,
    );
    return renderToStaticMarkup(
      group?.summary ? <GroupCard {...group} /> : <></>,
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
              formatter: ({ name }) => this.renderGroup(name),
            }}
            data={this.treeData}
          />
        </SVGCharts>
      </>
    );
  }
}
