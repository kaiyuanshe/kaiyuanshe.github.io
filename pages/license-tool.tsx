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
        label={t('step_x', { step: keyIndex + 1 })}
      />
      <ButtonGroup className="mb-2">
        {optionValue()[chooseSteps[keyIndex]].map(({ value, text }) => (
          <Button
            key={value}
            className="mx-1"
            value={value}
            id={`tb-${value}`}
            disabled={disableChoose}
            onClick={({ currentTarget: { value } }) => handleChoose(value)}
          >
            {text}
          </Button>
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
      [FeatureAttitude.Positive]: t('attitude_positive'),
      [FeatureAttitude.Negative]: t('attitude_negative'),
      [FeatureAttitude.Undefined]: t('option_undefined'),
    }[attitude] || t('option_undefined'));

  const judgeInfectionRange = (infectionRange: InfectionRange | undefined) => {
    return infectionRange !== undefined
      ? {
          [InfectionRange.Library]: t('range_library'),
          [InfectionRange.File]: t('range_file'),
          [InfectionRange.Module]: t('range_module'),
        }[infectionRange]
      : t('option_undefined');
  };

  return (
    <>
      <ul>
        <li>
          {t('feature_popularity')}: {judge(feature.popularity)}
        </li>
        <li>
          {t('feature_reuse_condition')}: {judge(feature.reuseCondition)}
        </li>
        <li>
          {t('feature_infection_intensity')}:{' '}
          {judge(feature.infectionIntensity)}
        </li>

        <li>
          {t('feature_infection_range')}:
          {judgeInfectionRange(feature.infectionRange)}
        </li>

        <li>
          {t('feature_jurisdiction')}: {judge(feature.jurisdiction)}
        </li>
        <li>
          {t('feature_patent_statement')}: {judge(feature.patentStatement)}
        </li>
        <li>
          {t('feature_patent_retaliation')}: {judge(feature.patentRetaliation)}
        </li>
        <li>
          {t('feature_enhanced_attribution')}:{' '}
          {judge(feature.enhancedAttribution)}
        </li>
        <li>
          {t('feature_privacy_loophole')}: {judge(feature.privacyLoophole)}
        </li>
        <li>
          {t('feature_marketing_endorsement')}:
          {judge(feature.marketingEndorsement)}
        </li>
      </ul>
      <Button size="sm" target="_blank" href={link}>
        {t('license_detail')}
      </Button>
    </>
  );
}

export default LicenseTool;
