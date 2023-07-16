import { i18n } from '../../models/Translation';

const { t } = i18n;

export const slogan = () => [
  {
    title: t('our_vision'),
    items: [{ text: t('our_vision_content'), icon: 'globe2' }],
  },
  {
    title: t('our_mission'),
    items: [
      { text: t('open_source_governance'), icon: 'diagram-3' },
      { text: t('global_bridging'), icon: 'globe2' },
      { text: t('community_development'), icon: 'people' },
      { text: t('project_incubation'), icon: 'git' },
    ],
  },
  {
    title: t('our_principles'),
    items: [
      { text: t('contribution'), icon: 'vector-pen' },
      { text: t('consensus'), icon: 'person-hearts' },
      { text: t('collegiality'), icon: 'diagram-3' },
    ],
  },
];

export const social = {
  github: 'https://github.com/kaiyuanshe',
  twitter: 'https://twitter.com/kaiyuanshe',
  facebook: 'https://www.facebook.com/kaiyuanshe.china',
};
