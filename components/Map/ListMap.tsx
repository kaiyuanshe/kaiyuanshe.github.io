import { Icon } from 'idea-react';
import { LatLngTuple } from 'leaflet';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ImagePreview } from 'mobx-restful-table';
import { MarkerMeta, OpenReactMapProps } from 'open-react-map';
import { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { buildURLData } from 'web-utility';

import systemStore from '../../models/Base/System';
import ChinaMap from './ChinaMap';

export interface ImageMarker extends MarkerMeta {
  title: string;
  summary?: string;
  image?: string;
}

export interface ListMapProps extends OpenReactMapProps {
  markers: ImageMarker[];
}

@observer
export default class ListMap extends Component<ListMapProps> {
  @observable
  accessor drawerOpen = false;

  @computed
  get drawerWidth() {
    return this.drawerOpen
      ? systemStore.screenNarrow
        ? 'w-100'
        : 'w-25'
      : 'w-auto';
  }

  @observable
  accessor currentMarker: ImageMarker | undefined;

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

    return `https://uri.amap.com/marker?${buildURLData({
      position: [longitude, latitude],
      name: title,
      src: 'KaiYuanShe',
      coordinate: 'gaode',
      callnative: 1,
    })}`;
  }

  renderItem = (marker: ImageMarker) => (
    <ListGroup.Item
      key={marker.title}
      className="d-flex gap-2 justify-content-between cursor-pointer"
      onClick={this.selectOne(marker)}
    >
      <ImagePreview className="w-25" loading="lazy" src={marker.image} fluid />
      <div>
        <h3 className="fs-5">{marker.title}</h3>
        <p>{marker.summary}</p>
      </div>
      <a href={this.makeGaoDeLink(marker)} target="_blank" rel="noreferrer">
        <Icon name="geo-alt-fill" className="fs-3" />
      </a>
    </ListGroup.Item>
  );

  render() {
    const { className = '', style, markers, ...props } = this.props,
      { drawerOpen, drawerWidth, currentMarker } = this;

    return (
      <div className={`position-relative ${className}`} style={style}>
        <ChinaMap
          className="h-100"
          {...props}
          markers={currentMarker && [currentMarker]}
        />
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
            {markers.map(this.renderItem)}
          </ListGroup>
        </div>
      </div>
    );
  }
}
