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

import PageHead from '../components/PageHead';
import { optionValue, licenseTips } from '../components/License/helper';
console.log('licenseTips', licenseTips);

interface List {
  license: License;
  score: number;
}

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
      <h1>开源许可证选择器</h1>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <p className="text-warning">切记：必须阅读并理解您选择的许可协议。</p>

      <h2>筛选条件</h2>

      {licenseTips()[chooseSteps[keyIndex]].map(({ text }) => (
        <p key={text}>{text}</p>
      ))}

      <ProgressBar
        className="mb-3"
        variant="info"
        now={(keyIndex + 1) * now}
        label={`第${keyIndex + 1}步`}
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
              {license.name} 评分: {score * 10}
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
      [FeatureAttitude.Undefined]: '不明确',
    }[attitude] || '不明确');

  const judgeInfectionRange = (infectionRange: InfectionRange | undefined) => {
    infectionRange != undefined
      ? {
          [InfectionRange.Library]: 'Library',
          [InfectionRange.File]: 'File',
          [InfectionRange.Module]: 'Module',
        }[infectionRange]
      : '不明确';
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
