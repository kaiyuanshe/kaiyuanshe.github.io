import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Loading } from 'idea-react';
import { SVGCharts, Tooltip, TreeMapSeries } from 'echarts-jsx';

import { fileBaseURI } from '../../models/Base';
import organizationStore from '../../models/Organization';

@observer
export default class OrganizationLandscape extends PureComponent {
  componentDidMount() {
    organizationStore.groupAllByTags();
  }

  render() {
    const { downloading, tagMap } = organizationStore;

    return (
      <>
        {downloading > 0 && <Loading />}

        <SVGCharts style={{ height: '80vh' }}>
          <Tooltip />

          <TreeMapSeries
            levels={[{}, { upperLabel: { show: true } }]}
            data={Object.entries(tagMap).map(([name, list]) => ({
              name,
              children: list.map(({ name }) => ({ name: name + '', value: 1 })),
            }))}
            tooltip={{
              formatter: ({ name }) =>
                renderToStaticMarkup(
                  <div className="text-center">
                    <h3 className="h5 mb-3">{name}</h3>
                    <img
                      style={{ maxWidth: '10rem' }}
                      src={`${fileBaseURI}/${name}.png`}
                    />
                  </div>,
                ),
            }}
          />
        </SVGCharts>
      </>
    );
  }
}
