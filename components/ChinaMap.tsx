import { FC } from 'react';
import { OpenMap, OpenMapProps } from 'idea-react';

const ChinaMap: FC<OpenMapProps> = props => (
  <OpenMap center={[34.32, 108.55]} zoom={4} {...props} />
);
export default ChinaMap;
