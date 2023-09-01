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
                  href={`https://uri.amap.com/navigation?to=${marker.position[1]},${marker.position[0]},${marker.title}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="green"
                    className="bi bi-geo-alt-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
