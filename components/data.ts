import { TimeDistanceProps } from 'idea-react';
import { textJoin } from 'mobx-i18n';

import { i18n } from '../models/Base/Translation';
import { Link } from './Layout/MainNav';

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
      { title: t('council'), path: '/department/council' },
      {
        title: t('advisory_committee'),
        path: '/department/committee/consultant',
      },
      {
        title: t('legal_advisory_committee'),
        path: '/department/committee/legal-advisory',
      },
      { title: t('community_list'), path: '/community' },
      { title: t('our_members'), path: '/member' },
      { title: t('COSCon_star'), path: '/community/award/COSCon-star' },
      {
        title: t('open_source_star'),
        path: '/community/award/Open-Source-star',
      },
      {
        title: t('community_cooperation_star'),
        path: '/community/award/community-cooperation-star',
      },
      {
        title: t('general_election'),
        path: '/election',
      },
    ],
  },
  {
    title: t('our_articles'),
    subs: [
      { title: t('coscon'), path: '/search?tag=COSCon' },
      {
        title: t('kcc'),
        path: '/search?tag=KCC',
      },
      {
        title: t('open_source_book_club'),
        path: '/search?tag=读书会',
      },
      {
        title: t('original_articles'),
        path: '/article?type=原创',
      },
      {
        title: t('translated_articles'),
        path: '/article?type=翻译',
      },
      { title: t('all_articles'), path: '/article' },
    ],
  },
  {
    title: t('wonderful_activity'),
    subs: [
      { title: t('host_activity'), path: '/activity' },
      { title: t('activity_articles_calendar'), path: '/activity/calendar' },
    ],
  },
  {
    title: t('community_development'),
    subs: [
      {
        title: t('china_open_source_annual_report'),
        path: 'https://kaiyuanshe.feishu.cn/wiki/wikcnUDeVll6PNzw900yPV71Sxd',
      },
      {
        title: t('china_open_source_pioneer'),
        path: '/community/award/China-Open-Source-pioneer',
      },
      { title: t('china_open_source_landscape'), path: '/organization' },
    ],
  },
  {
    title: t('open_source_projects'),
    subs: [
      {
        title: t('open_source_treasure_box'),
        path: 'https://oss-toolbox.vercel.app/',
      },
      {
        title: t('open_hackathon_platform'),
        path: 'https://hackathon.kaiyuanshe.cn/',
      },
      {
        title: t('xiaoyuan_chatbot'),
        path: 'https://aitable.ai/share/shrLPzmeV2iapzGSowywU',
      },
    ],
  },
  {
    title: t('about_us'),
    subs: [
      {
        title: t('about_us'),
        path: 'https://kaiyuanshe.feishu.cn/wiki/wikcn749HAOCD2dwaNq4dOC67db',
      },
      {
        title: t('kaiyuanshe_annual_report'),
        path: 'https://kaiyuanshe.feishu.cn/wiki/U2S7wudEUisLdnkqUadczo1SnSc',
      },
      {
        title: textJoin(t('KaiYuanShe'), t('cultural_and_creative_store')),
        path: 'https://www.xiaohongshu.com/user/profile/6528f512000000002a018253',
      },
      { title: t('our_partners'), path: '/organization/cooperation' },
      {
        title: t('kys_forum'),
        path: 'https://github.com/orgs/kaiyuanshe/discussions',
      },
      {
        title: t('meeting_calendar'),
        path: '/meeting-calendar',
      },
    ],
  },
];
