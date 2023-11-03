import { FC } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

import styles from './index.module.less';

export interface ImageScrollableBoxProps extends ImageProps {
  duration?: string;
}

export const ImageScrollableBox: FC<ImageScrollableBoxProps> = ({
  src,
  loading = 'lazy',
  duration,
  ...props,
}) => (
    <div
      className={`d-inline-block mh-100 ${styles.scrollWrap}`}
      // @ts-ignore
      style={{ '--duration': duration }}
    >
      <Image
        className={`d-inline-block ${styles.scrollItem}`}
        {...{ ...props, src, loading }}
      />
    </div>
  );
