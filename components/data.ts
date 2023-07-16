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
    title: t('community_structure'),
    subs: [
      { title: t('community_structure_overview'), path: '/department' },
      { title: t('council'), path: '/members?anchor=理事会' },
      {
        title: t('executive_committee'),
        path: '/members?anchor=执行委员会',
      },
      {
        title: t('project_committee'),
        path: '/members?anchor=项目委员会',
      },
      {
        title: t('advisory_committee'),
        path: '/members?anchor=顾问委员会',
      },
      {
        title: t('legal_advisory_committee'),
        path: '/members?anchor=法律咨询委员会',
      },
      { title: t('our_members'), path: '/members' },
    ],
  },
  {
    title: t('our_blogs'),
    subs: [
      { title: t('coscon'), path: '/search?tag=COSCon' },
      {
        title: t('kcc'),
        path: '/search?tag=KCC',
      },
      {
        title: t('open_source_book_club'),
        path: '',
      },
      {
        title: t('original_blogs'),
        path: '',
      },
      {
        title: t('translation_blogs'),
        path: '',
      },
      { title: t('all_blogs'), path: '/article' },
    ],
  },
  {
    title: t('our_annual_report'),
    subs: [
      {
        title: t('china_open_source_annual_report'),
        path: 'https://kaiyuanshe.feishu.cn/wiki/wikcnUDeVll6PNzw900yPV71Sxd',
      },
      {
        title: t('kaiyuanshe_annual_report'),
        path: 'https://kaiyuanshe.feishu.cn/wiki/U2S7wudEUisLdnkqUadczo1SnSc',
      },
    ],
  },
  { title: t('wonderful_activity'), path: '/activity' },
  { title: t('our_partners'), path: '/organization/cooperation' },
  {
    title: t('open_source_treasure_box'),
    subs: [
      { title: t('china_open_source_landscape'), path: '/organization' },
      { title: t('Web_polyfill_CDN'), path: 'https://polyfill.kaiyuanshe.cn/' },
      { title: t('open_source_mirror'), path: 'http://mirror.kaiyuanshe.cn/' },
      { title: t('license_tool'), path: '/license-tool' },
    ],
  },
  {
    title: t('about_us'),
    path: 'https://kaiyuanshe.feishu.cn/wiki/wikcn749HAOCD2dwaNq4dOC67db',
  },
];
