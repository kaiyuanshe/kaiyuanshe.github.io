import { SVGCharts, Tooltip, TreeMapSeries } from 'echarts-jsx';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { OrganizationCard } from './Card';
import { OpenCollaborationMapProps } from './index';

@observer
export default class OpenCollaborationLandscape extends Component<OpenCollaborationMapProps> {
  componentDidMount() {
    this.props.store.groupAllByTags();
  }

  renderCard(name: string) {
    const organization = this.props.store.allItems.find(
      ({ name: n }) => n === name,
    );
    if (!organization) return <></>;

    const { id, ...data } = organization;

    return <OrganizationCard style={{ maxWidth: '25rem' }} {...data} />;
  }

  render() {
    const { downloading, tagMap } = this.props.store;

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
