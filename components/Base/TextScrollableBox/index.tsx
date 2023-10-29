import { FC } from 'react';

import style from './style.module.less';

export const TextScrollableBox: FC = ({ children }) => (
    <div className={style.box}>
      <div className={style.scrollItem}>{children}</div>
    </div>
  );
