import { MarkerMeta } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import { Activity } from '../../models/Activity';
import { Place } from '../../models/Place';

const ChinaMap = dynamic(() => import('../../components/ChinaMap'), {
  ssr: false,
});

export interface ActivityMapProps extends Activity {
  places: Place[];
}

export const ActivityMap: FC<ActivityMapProps> = ({ location, places }) => {
  const [longitude, latitude] =
    (location as TableCellLocation)?.location.split(',') || [];

  return (
    <ChinaMap
      center={[+latitude, +longitude]}
      zoom={18}
      markers={
        places
          .map(({ name, location }) => {
            const [lng, lat] =
              (location as TableCellLocation)?.location.split(',') || [];

            return location && { tooltip: name, position: [+lat, +lng] };
          })
          .filter(Boolean) as MarkerMeta[]
      }
    />
  );
};
