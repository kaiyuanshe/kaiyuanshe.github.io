import { FC } from 'react';
import { Image } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import styles from './index.module.less';

type ImageScrollableBoxProps = {
  url: string;
  duration?: string;
};
export const ImageScrollableBox: FC<ImageScrollableBoxProps> = ({
  url,
  duration,
}: ImageScrollableBoxProps) => {
  return (
    <div
      className={`d-inline-block mh-100 ${styles.scrollWrap}`}
      // @ts-ignore
      style={{ '--duration': duration }}
    >
      <Image
        className={`d-inline-block ${styles.scrollItem}`}
        src={blobURLOf(url)}
        loading={'lazy'}
      />
    </div>
  );
};
