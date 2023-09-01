import { Icon } from 'idea-react';
import { LatLngTuple } from 'leaflet';
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

  componentDidMount() {
    this.drawerOpen = !systemStore.screenNarrow;
  }

  selectOne = (marker: ImageMarker) => () => {
    this.currentMarker = {
      tooltip: [marker.title, marker.summary].filter(Boolean).join(' - '),
      ...marker,
    };
    if (systemStore.screenNarrow) this.drawerOpen = false;
  };

  makeGaoDeLink({ position, title }: ImageMarker) {
    const [latitude, longitude] = position as LatLngTuple;

    return `https://uri.amap.com/navigation?${new URLSearchParams({
      to: [longitude, latitude, title] + '',
      mode: 'car',
      policy: '1',
      src: 'KaiYuanShe',
      coordinate: 'gaode',
      callnative: '0',
    })}`;
  }

  render() {
    const { className = '', style, markers, ...props } = this.props,
      { drawerOpen, drawerWidth, currentMarker } = this;

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
                key={marker.title}
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
                  href={this.makeGaoDeLink(marker)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="geo-alt-fill" className="fs-3" />
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
