import { FeatureAttitude, InfectionRange } from 'license-filter';

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
    { value: FeatureAttitude.Undefined, text: '两者皆可同时' },
    {
      value: FeatureAttitude.Positive,
      text: '我需要',
    },
    { value: FeatureAttitude.Negative, text: '我不需要' },
  ];
  return optionValue;
}, {});

optionValue.infectionRange = [
  { value: 0, text: '不进行要求' },
  { value: InfectionRange.Library, text: '传染范围到库' },
  { value: InfectionRange.File, text: '传染范围到文件' },
  { value: InfectionRange.Module, text: '传染范围到模块' },
];

const licenseTips: LicenseTips = {
  popularity: [
    {
      text: '您想将结果限定为开放源代码促进会 (OSI) 所描述的“流行并广泛使用，或拥有广泛社区群”的许可协议吗？',
    },
    {
      text: '这将以牺牲一些更冷僻但或许有用的特征为代价来确保该许可协议成为“主流”协议。',
    },
  ],
  reuseCondition: [{ text: '您想对代码的重复使用设置许可条件吗?' }],
  infectionIntensity: [{ text: '您是否想选择强传染的协议？' }],
  jurisdiction: [{ text: '您是否想将自己所在区域作为司法管辖区' }],
  patentStatement: [{ text: '您是否想使用明确授予专利权的许可协议（如果有）' }],
  patentRetaliation: [{ text: '您是否想使用包含专利报复条款的许可协议' }],
  enhancedAttribution: [{ text: '您是否想使用指定“增强型归属”的许可协议' }],
  privacyLoophole: [{ text: '您是否想使用解决“隐私漏洞”的许可协议' }],
  marketingEndorsement: [{ text: '您是否想允许推广的许可协议' }],
  infectionRange: [
    {
      text: '您想对修改版的哪些部分可以适用其它许可协议,有 模块级，文件级，库接口级三个选择',
    },
  ],
};

export { optionValue, licenseTips };
