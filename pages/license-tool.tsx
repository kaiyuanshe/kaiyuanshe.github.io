import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import {
  FeatureAttitude,
  InfectionRange,
  filterLicenses,
  License,
} from 'license-filter';

import { ProgressBar, Dropdown, Accordion } from 'react-bootstrap';

import { optionValue, licenseTips } from '../components/License/helper';

import styles from '../styles/Home.module.less';

interface List {
  license: License;
  score: number;
}

const LicenseTool: NextPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [keyIndex, setKeyIndex] = useState(0);
  const [filterOption, setFilterOption] = useState({});
  const [disableDropdown, setDisableDropdown] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

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

  // rome-ignore lint/style/useConst: <explanation>
  let choose: string | null = null;

  const now = Math.ceil(100 / chooseSteps.length);

  useEffect(() => {
    if (stepIndex === chooseSteps.length) setDisableDropdown(true);
  }, [chooseSteps.length, stepIndex]);

  const handleSelect = (value: string | null) => {
    const choice = value
      ? ['0', '1', '-1'].includes(value)
        ? Number(value)
        : value
      : 0;

    const key = chooseSteps[keyIndex];
    const newObject = { ...filterOption, [key]: choice };

    const tempLists = filterLicenses(newObject);

    setFilterOption({ ...newObject });

    setLists(tempLists);

    setStepIndex(stepIndex < chooseSteps.length ? stepIndex + 1 : stepIndex);

    setKeyIndex(keyIndex < chooseSteps.length - 1 ? keyIndex + 1 : keyIndex);
  };

  return (
    <div className={styles.container}>
      <br />
      <h1>开源许可证选择器</h1>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <p className="text-warning">切记：必须阅读并理解您选择的许可协议。</p>
      <div>
        <p>
          <h2>筛选条件</h2>
        </p>
      </div>
      <div>
        {licenseTips[chooseSteps[keyIndex]].map(({ text }) => (
          // eslint-disable-next-line react/jsx-key
          <p>{text}</p>
        ))}
      </div>

      <div className="mb-3">
        <ProgressBar
          variant="info"
          now={(keyIndex + 1) * now}
          label={`第${keyIndex + 1}步`}
        />
      </div>
      <br />
      <div>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            disabled={disableDropdown}
            id="dropdown-basic-button"
            title={choose || '请选择'}
          >
            {choose || '请选择'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionValue[chooseSteps[keyIndex]].map(({ value, text }) => (
              <Dropdown.Item key={value} eventKey={value}>
                {text}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="mt-3">
        <Accordion defaultActiveKey="0">
          {lists.map(({ license, score }, index) => (
            // eslint-disable-next-line react/jsx-key
            <Accordion.Item key={license.name} eventKey={index + 1 + ''}>
              <Accordion.Header>
                {license.name} 评分: {score * 10}
              </Accordion.Header>
              <Accordion.Body>{renderInfo(license)}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

function renderInfo({ link, feature }: License) {
  const InfectionRangeKey = {
    [InfectionRange.Library]: 'Library',
    [InfectionRange.File]: 'File',
    [InfectionRange.Module]: 'Module',
  };

  const judge = (attitude: FeatureAttitude) =>
    ({
      [FeatureAttitude.Positive]: 'Yes',
      [FeatureAttitude.Negative]: 'No',
      [FeatureAttitude.Undefined]: '不明确',
    }[attitude] || '不明确');

  return (
    <div>
      <p>{`流行程度:   ${judge(feature.popularity)}`}</p>
      <p>{`复用条件: ${judge(feature.reuseCondition)}`}</p>
      <p>{`传染强度: ${judge(feature.infectionIntensity)}`}</p>
      {
        <p>{`传染范围: ${
          feature.infectionRange
            ? feature.infectionRange in InfectionRangeKey
              ? InfectionRangeKey[feature.infectionRange]
              : '不明确'
            : '不明确'
        }`}</p>
      }
      <p>{`法律管辖: ${judge(feature.jurisdiction)}`}</p>
      <p>{`专利声明: ${judge(feature.patentStatement)}`}</p>
      <p>{`专利报复: ${judge(feature.patentRetaliation)}`}</p>
      <p>{`增强署名: ${judge(feature.enhancedAttribution)}`}</p>
      <p>{`隐私漏洞: ${judge(feature.privacyLoophole)}`}</p>
      <p>{`营销背书：${judge(feature.marketingEndorsement)}`}</p>
      <a href={link}>协议详情</a>
    </div>
  );
}

export default LicenseTool;
