import { FC, PropsWithChildren } from 'react';

import style from './style.module.less';

export type TextScrollableBoxProps = PropsWithChildren<{
  width?: number;
  duration?: string;
}>;

export const TextScrollableBox: FC<TextScrollableBoxProps> = ({
  children,
  width,
  duration,
}) => (
    <div className={style.box} style={{ width, '--duration': duration }>
      <div className={style.scrollWrap}>
        <div className={style.scrollItem}>{children}</div>
      </div>
    </div>
  );
