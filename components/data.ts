import { TimeDistanceProps } from 'idea-react';

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
}

export const MainRoute = {
  [SearchScope.User]: { title: '开源人', path: '/user' },
  [SearchScope.Article]: { title: '文　章', path: '/article' },
};
