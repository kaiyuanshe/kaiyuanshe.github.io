import { FC, PropsWithChildren } from 'react';

import style from './style.module.less';

export type TextScrollableBoxProps = PropsWithChildren<{
  width?: string;
  duration?: string;
}>;

export const TextScrollableBox: FC<TextScrollableBoxProps> = ({
  children,
  width,
  duration,
}) => (
  // @ts-ignore
  <div className={style.box} style={{ width: width || '80px' }}>
    <div
      className={style.scrollWrap}
      // @ts-ignore
      style={{ '--duration': duration }}
    >
      <div className={style.scrollItem}>{children}</div>
    </div>
  </div>
);
