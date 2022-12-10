import { i18n } from '../../models/Translation';

const { t } = i18n;

export const slogan = () => [
  {
    title: t('our_principles'),
    items: [
      { text: t('contribution'), icon: 'vector-pen' },
      { text: t('consensus'), icon: 'person-hearts' },
      { text: t('co_governance'), icon: 'diagram-3' },
    ],
  },
  {
    title: t('our_mission'),
    items: [
      { text: t('open_source_governance'), icon: 'diagram-3' },
      { text: t('international_bridge'), icon: 'globe2' },
      { text: t('community_development'), icon: 'people' },
      { text: t('open_source_project'), icon: 'git' },
    ],
  },
];

export const social = {
  github: 'https://github.com/kaiyuanshe',
  twitter: 'https://twitter.com/contactkaiyuan1',
  facebook: 'https://www.facebook.com/kaiyuanshe.china',
};
