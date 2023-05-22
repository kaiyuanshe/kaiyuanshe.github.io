import { FeatureAttitude, InfectionRange } from 'license-filter';
import { i18n } from '../../models/Translation';
const { t } = i18n;

type OptionValue = Record<string, { value: number; text: string }[]>;

type LicenseTips = Record<string, { text: string }[]>;

const options: string[] = [
  'popularity',
  'reuseCondition',
  'infectionIntensity',

  'jurisdiction',
  'patentStatement',
  'patentRetaliation',
  'enhancedAttribution',
  'privacyLoophole',
  'marketingEndorsement',
];

const optionValue = options.reduce((optionValue: OptionValue, option) => {
  optionValue[option] = [
    { value: FeatureAttitude.Undefined, text: t('feature_attitude_undefined') },
    {
      value: FeatureAttitude.Positive,
      text: t('feature_attitude_positive'),
    },
    { value: FeatureAttitude.Negative, text: t('feature_attitude_negative') },
  ];
  return optionValue;
}, {});

optionValue.infectionRange = [
  { value: 0, text: t('infection_range_undefined') },
  { value: InfectionRange.Library, text: t('infection_range_library') },
  { value: InfectionRange.File, text: t('infection_range_file') },
  { value: InfectionRange.Module, text: t('infection_range_module') },
];

const licenseTips: LicenseTips = {
  popularity: [
    { text: t('tip_popularity_0') },
    { text: t('tip_popularity_1') },
  ],
  reuseCondition: [{ text: t('tip_reuse_condition') }],
  infectionIntensity: [{ text: t('tip_infection_intensity') }],
  jurisdiction: [{ text: t('tip_jurisdiction') }],
  patentStatement: [{ text: t('tip_patent_statement') }],
  patentRetaliation: [{ text: t('tip_patent_retaliation') }],
  enhancedAttribution: [{ text: t('tip_enhanced_attribution') }],
  privacyLoophole: [{ text: t('tip_privacy_loophole') }],
  marketingEndorsement: [{ text: t('tip_marketing_endorsement') }],
  infectionRange: [{ text: t('tip_infection_range') }],
};

export { optionValue, licenseTips };
