import { SVGCharts, Tooltip, TreeMapSeries } from 'echarts-jsx';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import organizationStore from '../../models/Organization';
import { OrganizationCard } from './Card';

@observer
export default class OrganizationLandscape extends PureComponent {
  componentDidMount() {
    organizationStore.groupAllByTags();
  }

  renderCard(name: string) {
    const organization = organizationStore.allItems.find(
      ({ name: n }) => n === name,
    );
    if (!organization) return <></>;

    const { id, ...data } = organization;

    return <OrganizationCard style={{ maxWidth: '25rem' }} {...data} />;
  }

  render() {
    const { downloading, tagMap } = organizationStore;

    return (
      <>
        {downloading > 0 && <Loading />}

        <SVGCharts style={{ height: '80vh' }}>
          <Tooltip triggerOn="click" />

          <TreeMapSeries
            levels={[{}, { upperLabel: { show: true } }]}
            data={Object.entries(tagMap).map(([name, list]) => ({
              name,
              children: list.map(({ name }) => ({ name: name + '', value: 1 })),
            }))}
            tooltip={{
              formatter: ({ name }) =>
                renderToStaticMarkup(this.renderCard(name)),
            }}
          />
        </SVGCharts>
      </>
    );
  }
}
