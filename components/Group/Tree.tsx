import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Loading } from 'idea-react';
import Router from 'next/router';
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
        name: t('KaiYuanShe'),
        children: [
          {
            name: t('council'),
            children: [
              {
                name: t('executive_committee'),
                collapsed: false,
                children: departments?.map(({ name }) => ({
                  name: name + '',
                  target: '#执行委员会',
                })),
              },
              {
                name: t('project_committee'),
                collapsed: false,
                children: projects?.map(({ fullName }) => ({
                  name: fullName + '',
                  target: '#项目委员会',
                })),
              },
            ],
          },
          {
            name: t('consultant_committee'),
            target: '/expert#顾问委员会',
          },
          {
            name: t('legal_advisory_committee'),
            target: '/expert#法律咨询委员会',
          },
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

  jumpLink(data: Record<string, string>) {
    if (data.target) {
      data.name ? sessionStorage.setItem('members_projectname', data.name.replace(/项目组$/,"")) : '';

      Router.push(`/members${data.target}`, undefined, { scroll: false }).then(
        () => {
          const el: HTMLElement = document.getElementById(
            data.target.replace(/[^#]*#([\S\s]+)/,'$1'),
          ) as HTMLElement;
          if (typeof el !== 'undefined') {
            const scrollTopY = el!.offsetTop - 100;
            window.scrollTo({
              top: scrollTopY,
              behavior: 'smooth',
            });
          }
        },
      );
    }
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
            onClick={({ data }) =>
              this.jumpLink(data as Record<string, string>)
            }
          />
        </SVGCharts>
      </>
    );
  }
}
