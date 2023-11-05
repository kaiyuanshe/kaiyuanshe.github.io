import { FC, PropsWithChildren } from 'react';

import styles from './index.module.less';

export type VerticalScrollableBoxProps = PropsWithChildren<{
  duration?: string;
}>;

export const VerticalScrollableBox: FC<VerticalScrollableBoxProps> = ({
  children,
  duration,
}) => (
  <div
    className={`d-inline-block mh-100 ${styles.scrollWrap}`}
    // @ts-ignore
    style={{ '--duration': duration }}
  >
    <div className={`d-inline-block ${styles.scrollItem}`}>{children}</div>
  </div>
);
