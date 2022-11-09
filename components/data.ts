import { TimeDistanceProps } from 'idea-react';

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

export enum SearchScope {
  User,
  Article,
  Organization,
  Cooperation,
}

export const MainRoute: Record<SearchScope, Link> = {
  [SearchScope.User]: { title: '开源人', path: '/user' },
  [SearchScope.Article]: { title: '文　章', path: '/article' },
  [SearchScope.Organization]: { title: '社　区', path: '/organization' },
  [SearchScope.Cooperation]: {
    title: '合作伙伴',
    path: '/organization/cooperation',
  },
};

export const MainRoutes = [
  { title: '成员', path: '/members' },
  { title: '组织机构', path: '/department' },
  { title: '开源地图', path: '/organization' },
  { title: '合作伙伴', path: '/organization/cooperation' },
];
