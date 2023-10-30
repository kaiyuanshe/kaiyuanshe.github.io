import { FC, ReactNode } from 'react';

import style from './style.module.less';

type TextScrollableBoxProps = {
  children: ReactNode;
  width?: number;
  duration?: string;
};
export const TextScrollableBox: FC<TextScrollableBoxProps> = ({
  children,
  width,
  duration,
}: TextScrollableBoxProps) => {
  let boxStyle = {};
  if (width) {
    boxStyle = Object.assign(boxStyle, { width });
  }
  if (duration) {
    boxStyle = Object.assign(boxStyle, { '--duration': duration });
  }
  return (
    <div className={style.box} style={boxStyle}>
      <div className={style.scrollWrap}>
        <div className={style.scrollItem}>{children}</div>
      </div>
    </div>
  );
};
