import { TimeDistanceProps } from 'idea-react';

import { i18n } from '../models/Translation';
import { Link } from './MainNav';

export const TimeOption: Pick<
  TimeDistanceProps,
  'unitWords' | 'beforeWord' | 'afterWord'
> = {
  unitWords: {
    ms: '毫秒',
    s: '秒',
    m: '分',
    H: '时',
    D: '日',
    W: '周',
    M: '月',
    Y: '年',
  },
  beforeWord: '前',
  afterWord: '后',
};

export const MainRoutes = (): Link[] => [
  { title: i18n.t('open_source_library'), path: '/article' },
  { title: i18n.t('full_member'), path: '/members' },
   { title: '精彩活动', path: '/activity' },
  { title: i18n.t('organization'), path: '/department' },
  { title: i18n.t('open_source_map'), path: '/organization' },
  { title: i18n.t('partner'), path: '/organization/cooperation' }
];
