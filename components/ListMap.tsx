import { faMapMarked } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from 'idea-react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ImagePreview } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { MarkerMeta, OpenReactMapProps } from 'open-react-map';
import { PureComponent } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

import systemStore from '../models/System';

const ChinaMap = dynamic(() => import('./ChinaMap'), { ssr: false });

export interface ImageMarker extends MarkerMeta {
  title: string;
  summary?: string;
  image?: string;
}

export interface ListMapProps extends OpenReactMapProps {
  markers: ImageMarker[];
}

@observer
export class ListMap extends PureComponent<ListMapProps> {
  constructor(props: ListMapProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  drawerOpen = false;

  @computed
  get drawerWidth() {
    return this.drawerOpen
      ? systemStore.screenNarrow
        ? 'w-100'
        : 'w-25'
      : 'w-auto';
  }

  @observable
  currentMarker?: ImageMarker = undefined;

  @observable
  latitude = '';

  @observable
  longitude = '';

  @observable
  adaptGeolocation = false;

  componentDidMount() {
    this.drawerOpen = !systemStore.screenNarrow;
    if ('geolocation' in navigator) {
      this.adaptGeolocation = true;
      const self = this;
      navigator.geolocation.getCurrentPosition(
        function (position) {
          self.latitude = position.coords.latitude.toFixed(6);
          self.longitude = position.coords.longitude.toFixed(6);
        },
        function (error) {
          console.error('Error getting local location:', error);
        },
      );
    }
  }

  selectOne = (marker: ImageMarker) => () => {
    this.currentMarker = {
      tooltip: [marker.title, marker.summary].filter(Boolean).join(' - '),
      ...marker,
    };
    if (systemStore.screenNarrow) this.drawerOpen = false;
  };

  render() {
    const { className = '', style, markers, ...props } = this.props,
      {
        drawerOpen,
        drawerWidth,
        currentMarker,
        latitude,
        longitude,
        adaptGeolocation,
      } = this;

    return (
      <div className={`position-relative ${className}`} style={style}>
        <ChinaMap {...props} markers={currentMarker && [currentMarker]} />

        <div
          className={`position-absolute end-0 top-0 h-100 overflow-y-auto d-flex align-items-start ${drawerWidth}`}
          style={{ zIndex: 1000 }}
        >
          <Button
            className="position-sticky top-0"
            variant={drawerOpen ? 'secondary' : 'primary'}
            onClick={() => (this.drawerOpen = !drawerOpen)}
          >
            <Icon name="layout-text-sidebar" />
          </Button>

          <ListGroup hidden={!drawerOpen}>
            {markers.map(marker => (
              <ListGroup.Item
                key={marker.tooltip}
                className="d-flex gap-2 justify-content-between"
                style={{ cursor: 'pointer' }}
                onClick={this.selectOne(marker)}
              >
                <ImagePreview className="w-25" fluid src={marker.image} />
                <div>
                  <h3 className="fs-5">{marker.title}</h3>
                  <p>{marker.summary}</p>
                </div>
                <a
                  href={
                    adaptGeolocation
                      ? `https://ditu.amap.com/dir?type=car&from[lnglat]=${longitude},${latitude}&from[name]=起点&to[lnglat]=${marker.position[1]},${marker.position[0]}&to[name]=${marker.title}&src=uriapi&callnative=0&innersrc=uriapi&policy=1`
                      : `https://ditu.amap.com/regeo?lng=${marker.position[1]}&lat=${marker.position[0]}&name=${marker.title}&callnative=0&innersrc=uriapimarker.position`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon className="flex-fill" icon={faMapMarked} />
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
