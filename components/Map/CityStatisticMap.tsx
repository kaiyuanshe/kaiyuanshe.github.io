import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import dynamic from 'next/dynamic';
import { MarkerMeta, OpenReactMapProps } from 'open-react-map';
import { Component } from 'react';

import { StatisticTrait } from '../../models/Activity';
import metaStore from '../../models/Base/System';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

export interface CityStatisticMapProps {
  store: StatisticTrait;
  onChange?: (city: string) => any;
}

@observer
@observePropsState
export class CityStatisticMap extends Component<CityStatisticMapProps> {
  declare observedProps: CityStatisticMapProps;

  componentDidMount() {
    metaStore.getCityCoordinate();

    this.props.store.getStatistic();
  }

  @computed
  get markers() {
    const { cityCoordinate } = metaStore,
      { city = {} } = this.observedProps.store.statistic;

    return Object.entries(city)
      .map(([city, count]) => {
        const point = cityCoordinate[city];

        if (point)
          return {
            tooltip: `${city} ${count}`,
            position: [point[1], point[0]],
          };
      })
      .filter(Boolean) as MarkerMeta[];
  }

  handleChange: OpenReactMapProps['onMarkerClick'] = ({
    latlng: { lat, lng },
  }) => {
    const { markers } = this;
    const { tooltip } =
      markers.find(
        ({ position: p }) => p instanceof Array && lat === p[0] && lng === p[1],
      ) || {};
    const [city] = tooltip?.split(/\s+/) || [];

    this.props.onChange?.(city);
  };

  render() {
    const { markers } = this;

    return (
      <div style={{ height: '70vh' }}>
        <ChinaMap
          center={[34.32, 108.55]}
          zoom={4}
          markers={markers}
          onMarkerClick={this.handleChange}
        />
      </div>
    );
  }
}
