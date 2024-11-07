import { observer } from 'mobx-react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../../components/Base/CommentBox';
import { ZodiacBar } from '../../../components/Base/ZodiacBar';
import { GroupCard } from '../../../components/Department/Card';
import { OKRCard } from '../../../components/Department/OKRCard';
import { ReportCard } from '../../../components/Department/ReportCard';
import { PageHead } from '../../../components/Layout/PageHead';
import { MemberGroup } from '../../../components/Member/Group';
import { MemberTitle } from '../../../components/Member/Title';
import { i18n, t } from '../../../models/Base/Translation';
import { OKR, OKRModel } from '../../../models/Governance/OKR';
import { Report, ReportModel } from '../../../models/Governance/Report';
import { Personnel, PersonnelModel } from '../../../models/Personnel';
import {
  Department,
  DepartmentModel,
} from '../../../models/Personnel/Department';

interface DepartmentDetailPageProps {
  department: Department;
  group: Record<string, Personnel[]>;
  okrList: OKR[];
  reportList: Report[];
}

export const getServerSideProps = compose<
  Record<'name' | 'year', string>,
  DepartmentDetailPageProps
>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { name, year = 0 } = {} }) => {
    const [department] = await new DepartmentModel().getList({ name });

    if (!department) return { notFound: true, props: {} };

    const [group, okrList, reportList] = await Promise.all([
      new PersonnelModel().getGroup(
        { department: name, passed: true },
        ['position'],
        +year,
      ),
      new OKRModel().getAll({ department: name, year }),
      new ReportModel().getAll({ department: name, summary: year }),
    ]);

    return {
      props: JSON.parse(
        JSON.stringify({ department, group, okrList, reportList }),
      ),
    };
  },
);

const DepartmentDetailPage: FC<DepartmentDetailPageProps> = observer(
  ({ department, group, okrList, reportList }) => (
    <Container
      className="py-5"
      style={{
        filter: `grayscale(${okrList.length + reportList.length ? 0 : 1})`,
      }}
    >
      <PageHead title={department.name as string} />
      <Row>
        <Col xs={12} sm={4} className="d-flex flex-column gap-4">
          <GroupCard {...department} />

          <Button
            size="lg"
            target="_blank"
            href={`https://kaiyuanshe.feishu.cn/share/base/form/shrcnlDoJhBTHalhmiZJr8rax0g?${new URLSearchParams(
              {
                prefill_申请类型: '任命',
                prefill_申请职位: '志愿者',
                prefill_意向部门: department.name as string,
              },
            )}`}
            disabled={!department.active}
          >
            {t('become_volunteer')}
          </Button>

          <ZodiacBar
            startYear={2014}
            itemOf={year => ({
              title: year,
              link: `/department/${department.name}/${year}`,
            })}
          />
        </Col>
        <Col xs={12} sm={8}>
          {Object.entries(group).map(([position, list]) => (
            <MemberGroup key={position} name={position} list={list} />
          ))}
          <MemberTitle title={t('OKR')} count={okrList.length} />

          <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
            {okrList.map(item => (
              <Col key={item.id as string} as="li">
                <OKRCard {...item} />
              </Col>
            ))}
          </Row>
          <MemberTitle title={t('monthly_report')} count={reportList.length} />

          <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
            {reportList.map(item => (
              <Col key={item.id as string} as="li">
                <ReportCard {...item} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
    </Container>
  ),
);

export default DepartmentDetailPage;
