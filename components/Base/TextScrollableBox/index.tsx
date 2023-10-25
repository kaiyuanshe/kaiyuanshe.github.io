import { ReactNode } from 'react';

import style from './style.module.less';

export default function TextScrollableBox({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={style.box}>
      <div className={style.scrollItem}>{children}</div>
    </div>
  );
}
