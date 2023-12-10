import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../components/Base/CommentBox';
import { GroupCard } from '../../components/Department/Card';
import PageHead from '../../components/Layout/PageHead';
import { MemberGroup } from '../../components/Member/Group';
import { i18n } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Department, DepartmentModel } from '../../models/Personnel/Department';

export const getServerSideProps = compose<
  { name: string },
  { department: Department; personnels: Personnel[] }
>(errorLogger, translator(i18n), async ({ params: { name } = {} }) => {
  const [department] = await new DepartmentModel().getList({ name });

  if (!department) return { notFound: true, props: {} };

  const personnels = await new PersonnelModel().getAll({ department: name });

  return {
    props: JSON.parse(JSON.stringify({ department, personnels })),
  };
});

const DepartmentDetailPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ department, personnels }) => (
  <Container className="py-5">
    <PageHead title={department.name as string} />
    <Row>
      <Col xs={12} sm={4}>
        <GroupCard {...department} />
      </Col>
      <Col xs={12} sm={8}>
        <MemberGroup name={department.name as string} list={personnels} />
      </Col>
    </Row>

    <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
  </Container>
);

export default DepartmentDetailPage;
