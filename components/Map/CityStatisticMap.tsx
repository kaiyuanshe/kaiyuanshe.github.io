import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import dynamic from 'next/dynamic';
import { MarkerMeta, OpenReactMapProps } from 'open-react-map';

import metaStore from '../../models/Base/System';
import { OrganizationStatistic } from '../../models/Community/Organization';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

export interface CityStatisticMapProps {
  data: OrganizationStatistic['city'];
  onChange?: (city: string) => any;
}

@observer
export class CityStatisticMap extends ObservedComponent<CityStatisticMapProps> {
  componentDidMount() {
    metaStore.getCityCoordinate();
  }

  @computed
  get markers() {
    const { cityCoordinate } = metaStore,
      { data } = this.observedProps;

    return Object.entries(data)
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

  handleChange: OpenReactMapProps['onMarkerClick'] = ({ latlng: { lat, lng } }) => {
    const { markers } = this;
    const { tooltip } =
      markers.find(({ position: p }) => p instanceof Array && lat === p[0] && lng === p[1]) || {};
    const [city] = tooltip?.split(/\s+/) || [];

    this.props.onChange?.(city);
  };

  render() {
    const { markers } = this;

    return (
      <ChinaMap
        style={{ height: '70vh' }}
        center={[34.32, 108.55]}
        zoom={4}
        markers={markers}
        onMarkerClick={this.handleChange}
      />
    );
  }
}
