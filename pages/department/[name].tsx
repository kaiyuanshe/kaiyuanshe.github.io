import { log } from 'console';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { MemberCard } from '../../components/Member/Card';
import { blobURLOf } from '../../models/Base';
import { CommentBox } from '../../components/Base/CommentBox';
import { GroupCard } from '../../components/Department/Card';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Department, DepartmentModel } from '../../models/Personnel/Department';

const { t } = i18n;

export const getServerSideProps = compose<
  { name: string },
  {
    department: Department;
    group: Record<string, Personnel[]>;
  }
>(cache(), errorLogger, translator(i18n), async ({ params: { name } = {} }) => {
  const [department] = await new DepartmentModel().getList({ name });

  if (!department) return { notFound: true, props: {} };

  const group = await new PersonnelModel().getYearGroup(
    { department: name, passed: true },
    ['createdAt'],
  );

  const personnels = await new PersonnelModel().getAll({
    department: name,
    passed: true,
  });
  return {
    props: JSON.parse(JSON.stringify({ department, group })),
  };
});

const DepartmentDetailPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ department, group }) => (
  <Container className="py-5">
    <PageHead title={department.name as string} />
    <Row>
      <Col xs={12} sm={4}>
        <GroupCard {...department} />
      </Col>
      <Col xs={12} sm={8}>
        {Object.entries(group)
          .sort(([a], [b]) => +b - +a)
          .map(([year, list]) => (
            <section key={year} id={year}>
              <h2 className="text-left my-5">{year}</h2>
              <ul className="list-unstyled d-flex flex-wrap justify-content-left gap-3">
                {list.map(({ id, position, recipient, recipientAvatar }) => (
                  <li
                    key={id as string}
                    className="d-flex flex-column align-items-center gap-2 position-relative"
                  >
                    <MemberCard
                      name={recipient + ''}
                      nickname={position + ''}
                      avatar={blobURLOf(recipientAvatar)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </Col>
    </Row>

    <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
  </Container>
);

export default DepartmentDetailPage;
