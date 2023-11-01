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
}: TextScrollableBoxProps) => {
  return (
    // @ts-ignore
    <div className={style.box} style={{ width, '--duration': duration }}>
      <div
        className={`d-inline-block align-top overflow-hidden text-nowrap mw-100`}
      >
        <div className={`d-inline-block float-start ${style.scrollItem}`}>
          {children}
        </div>
      </div>
    </div>
  );
}