import { FC, useEffect } from 'react';
import { tileLayer } from 'leaflet';
import 'leaflet.chinatmsproviders';
import { useMap } from 'react-leaflet';
import { OpenMap, OpenMapProps } from 'idea-react';

function ChinaTileLayer() {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    tileLayer.chinaProvider('GaoDe.Normal.Map').addTo(map);
  }, [map]);

  return <></>;
}

const ChinaMap: FC<OpenMapProps> = props => (
  <OpenMap {...props} renderTileLayer={() => <ChinaTileLayer />} />
);
export default ChinaMap;
