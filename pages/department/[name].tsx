import { text2color } from 'idea-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../components/Base/CommentBox';
import { LarkImage } from '../../components/Base/LarkImage';
import { GroupCard } from '../../components/Department/Card';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Department, DepartmentModel } from '../../models/Personnel/Department';

export const getServerSideProps = compose<
  { name: string },
  { department: Department; personnels: Personnel[] }
>(errorLogger, translator(i18n), async ({ params: { name } = {} }) => {
  const [department] = await new DepartmentModel().getList({ name });

  if (!department) return { notFound: true, props: {} };

  const personnels = await new PersonnelModel().getList({
    department: name,
  });

  return {
    props: JSON.parse(JSON.stringify({ department, personnels })),
  };
});

export default class DepartmentDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderPersonnel = ({ id, recipientAvatar, recipient }: Personnel) => (
    <li key={id as string} className="mb-3">
      <h3>{recipient as string}</h3>
      <LarkImage className="card-img-top rounded-0 " src={recipientAvatar} />
    </li>
  );

  render() {
    const { department, personnels } = this.props;
    const { name } = department;

    return (
      <Container className="py-5">
        <PageHead title={name as string} />
        <Row>
          <Col xs={12} sm={4}>
            <GroupCard {...department} />
          </Col>
          <Col xs={12} sm={8}>
            <h2>{name as string} Members</h2>

            <hr className="my-5" />

            <ol className="list-unstyled">
              {personnels.map(this.renderPersonnel)}
            </ol>
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
