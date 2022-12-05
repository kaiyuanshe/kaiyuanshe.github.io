import dynamic from 'next/dynamic';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { MarkerMeta, OpenMapProps } from 'idea-react';

import metaStore from '../models/Meta';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

type CityStatistic = Record<'city', Record<'string', number>>;

export interface CityStatisticMapProps {
  store: {
    statistic: CityStatistic;
    getStatistic: () => Promise<CityStatistic>;
  };
  onChange?: (city: string) => any;
}

@observer
export class CityStatisticMap extends PureComponent<CityStatisticMapProps> {
  componentDidMount() {
    metaStore.getCityCoordinate();
    this.props.store.getStatistic();
  }

  @computed
  get markers() {
    const { cityCoordinate } = metaStore,
      { city = {} } = this.props.store.statistic;

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

  handleChange: OpenMapProps['onMarkerClick'] = ({ latlng: { lat, lng } }) => {
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
