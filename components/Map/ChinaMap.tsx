import { OpenReactMap, OpenReactMapProps, TileLayer } from 'open-react-map';
import { FC } from 'react';

const ChinaMap: FC<OpenReactMapProps> = props => (
  <OpenReactMap
    {...props}
    renderTileLayer={() => <TileLayer vendor="GaoDe" />}
  />
);
export default ChinaMap;
