import { useState, useEffect, FC } from 'react';
import { observer } from 'mobx-react';

import {
  FeatureAttitude,
  InfectionRange,
  filterLicenses,
  License,
} from 'license-filter';

import {
  Container,
  ProgressBar,
  Accordion,
  ButtonGroup,
  ToggleButton,
  Button,
} from 'react-bootstrap';

import { i18n } from '../models/Translation';
import PageHead from '../components/PageHead';
import { optionValue, licenseTips } from '../components/License/helper';

interface List {
  license: License;
  score: number;
}

const { t } = i18n;

const chooseSteps: string[] = [
  'popularity',
  'reuseCondition',
  'infectionIntensity',
  'infectionRange',
  'jurisdiction',
  'patentStatement',
  'patentRetaliation',
  'enhancedAttribution',
  'privacyLoophole',
  'marketingEndorsement',
];

const LicenseTool: FC = observer(() => {
  const [stepIndex, setStepIndex] = useState(0);
  const [keyIndex, setKeyIndex] = useState(0);
  const [filterOption, setFilterOption] = useState({});
  const [disableChoose, setDisableChoose] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  const now = Math.ceil(100 / chooseSteps.length);

  useEffect(() => {
    if (stepIndex === chooseSteps.length) setDisableChoose(true);
  }, [stepIndex]);

  const handleChoose = (value: string | null) => {
    const choice = value ? +value : 0;

    const key = chooseSteps[keyIndex];
    const newObject = { ...filterOption, [key]: choice };

    const tempLists = filterLicenses(newObject);

    setFilterOption(newObject);

    setLists(tempLists);

    setStepIndex(stepIndex < chooseSteps.length ? stepIndex + 1 : stepIndex);

    setKeyIndex(keyIndex < chooseSteps.length - 1 ? keyIndex + 1 : keyIndex);
  };

  return (
    <Container className="py-5">
      <PageHead title="Open-source License selector" />
      <h1>{t('license_tool_headline')}</h1>
      <p>{t('license_tool_description')}</p>
      <p className="text-warning">{t('warn_info')}</p>

      <h2>{t('filter_option')}</h2>

      {licenseTips()[chooseSteps[keyIndex]].map(({ text }) => (
        <p key={text}>{text}</p>
      ))}

      <ProgressBar
        className="mb-3"
        variant="info"
        now={(keyIndex + 1) * now}
        label={t('step') + (keyIndex + 1) + t('step_unit')}
      />

      <ButtonGroup className="mb-2">
        {optionValue()[chooseSteps[keyIndex]].map(({ value, text }) => (
          <ToggleButton
            key={value}
            value={value}
            id={`tb-${value}`}
            disabled={disableChoose}
            onClick={({ currentTarget: { value } }) => handleChoose(value)}
          >
            {text}
          </ToggleButton>
        ))}
      </ButtonGroup>

      <Accordion defaultActiveKey="0">
        {lists.map(({ license, score }, index) => (
          <Accordion.Item key={license.name} eventKey={index + 1 + ''}>
            <Accordion.Header>
              {license.name} {t('license_score')}: {score * 10}
            </Accordion.Header>
            <Accordion.Body>{renderInfo(license)}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
});

function renderInfo({ link, feature }: License) {
  const judge = (attitude: FeatureAttitude) =>
    ({
      [FeatureAttitude.Positive]: 'Yes',
      [FeatureAttitude.Negative]: 'No',
      [FeatureAttitude.Undefined]: t('option_undefined'),
    }[attitude] || t('option_undefined'));

  const judgeInfectionRange = (infectionRange: InfectionRange | undefined) => {
    infectionRange != undefined
      ? {
          [InfectionRange.Library]: 'Library',
          [InfectionRange.File]: 'File',
          [InfectionRange.Module]: 'Module',
        }[infectionRange]
      : t('option_undefined');
  };

  return (
    <>
      <ul>
        <li>流行程度: {judge(feature.popularity)}</li>
        <li>复用条件: {judge(feature.reuseCondition)}</li>
        <li>传染强度: {judge(feature.infectionIntensity)}</li>

        <li>传染范围: {judgeInfectionRange(feature.infectionRange)}</li>

        <li>法律管辖: {judge(feature.jurisdiction)}</li>
        <li>专利声明: {judge(feature.patentStatement)}</li>
        <li>专利报复: {judge(feature.patentRetaliation)}</li>
        <li>增强署名: {judge(feature.enhancedAttribution)}</li>
        <li>隐私漏洞: {judge(feature.privacyLoophole)}</li>
        <li>营销背书：{judge(feature.marketingEndorsement)}</li>
      </ul>
      <Button size="sm" target="_blank" href={link}>
        协议详情
      </Button>
    </>
  );
}

export default LicenseTool;
