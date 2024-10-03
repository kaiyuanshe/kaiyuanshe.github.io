import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../../components/Base/CommentBox';
import { ZodiacBar } from '../../../components/Base/ZodiacBar';
import { GroupCard } from '../../../components/Department/Card';
import { OKRCard } from '../../../components/Department/OKRCard';
import { ReportCard } from '../../../components/Department/ReportCard';
import PageHead from '../../../components/Layout/PageHead';
import { MemberGroup } from '../../../components/Member/Group';
import { MemberTitle } from '../../../components/Member/Title';
import { i18n } from '../../../models/Base/Translation';
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

const DepartmentDetailPage: FC<DepartmentDetailPageProps> = ({
  department,
  group,
  okrList,
  reportList,
}) => (
  <Container className="py-5">
    <PageHead title={department.name as string} />
    <Row>
      <Col xs={12} sm={4}>
        <GroupCard className="mb-4" {...department} />

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
        <MemberTitle title="OKR" count={okrList.length} />

        <ol className="list-unstyled d-flex gap-3">
          {okrList.map(item => (
            <li key={item.id as string}>
              <OKRCard {...item} />
            </li>
          ))}
        </ol>
        <MemberTitle title="月报" count={reportList.length} />

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {reportList.map(item => (
            <Col as="li" key={item.id as string}>
              <ReportCard {...item} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>

    <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
  </Container>
);

export default DepartmentDetailPage;
