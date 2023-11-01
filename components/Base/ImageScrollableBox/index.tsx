import { FC } from 'react';
import { Image } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import styles from './index.module.less';

type ImageScrollableBoxProps = {
  url: string;
};
export const ImageScrollableBox: FC<ImageScrollableBoxProps> = ({
  url,
}: ImageScrollableBoxProps) => {
  return (
    <div className={`d-inline-block mh-100 ${styles.scrollWrap}`}>
      <Image
        className={`d-inline-block ${styles.scrollItem}`}
        src={blobURLOf(url)}
        loading={'lazy'}
      />
    </div>
  );
};
