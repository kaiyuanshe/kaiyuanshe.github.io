import dynamic from 'next/dynamic';
import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { TreeSeriesProps } from 'echarts-jsx';

import PageHead from '../../components/PageHead';
import groupStore from '../../models/Group';

const TreeChart = dynamic(() => import('../../components/TreeChart'), {
  ssr: false,
});

@observer
export default class DepartmentPage extends PureComponent {
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
        ],
      },
    ];
  }

  render() {
    return (
      <Container>
        <PageHead title="组织机构" />

        <TreeChart data={this.treeData} />
      </Container>
    );
  }
}
