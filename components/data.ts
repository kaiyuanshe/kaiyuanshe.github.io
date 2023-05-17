import { TimeDistanceProps } from 'idea-react';

import { isServer } from '../models/Base';
import { i18n } from '../models/Translation';
import { Link } from './MainNav';

const { t } = i18n;

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
  {
    title: t('about_us'),
    path: 'https://kaiyuanshe.feishu.cn/wiki/wikcn749HAOCD2dwaNq4dOC67db',
  },
  {
    title: t('our_members'),
    subs: [
      { title: t('our_members'), path: '/members' },
      {
        title: t('expert_committee'),
        path: '/members/expert',
      },
    ],
  },
  { title: t('our_community_structure'), path: '/department' },
  { title: t('our_blogs'), path: '/article' },
  { title: t('wonderful_activity'), path: '/activity' },
  { title: t('our_partners'), path: '/organization/cooperation' },
  {
    title: t('open_source_treasure_box'),
    subs: [
      { title: t('china_open_source_landscape'), path: '/organization' },
      { title: t('Web_polyfill_CDN'), path: 'https://polyfill.kaiyuanshe.cn/' },
      { title: t('open_source_mirror'), path: 'http://mirror.kaiyuanshe.cn/' },
      { title: t('license_tool'), path: '/license-tool/' },
    ],
  },
];
