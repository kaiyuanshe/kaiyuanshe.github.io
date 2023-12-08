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
    <li
      key={id as string}
      className="d-flex flex-column align-items-center gap-2 position-relative"
    >
      <LarkImage
        className="overflow-hidden rounded-circle position-relative"
        src={recipientAvatar}
        style={{ width: '6rem', height: '6rem' }}
      />
      <div>{recipient as string}</div>
    </li>
  );

  render() {
    const { department, personnels } = this.props;
    const { name } = department;
    const { t } = i18n;
    return (
      <Container className="py-5">
        <PageHead title={name as string} />
        <Row>
          <Col xs={12} sm={4}>
            <GroupCard {...department} />
          </Col>
          <Col xs={12} sm={8}>
            <h2>{name as string} {t('members')}</h2>
            
            <hr className="my-5" />

            <ul className="list-unstyled d-flex flex-wrap gap-3">
              {personnels.map(this.renderPersonnel)}
            </ul>
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
