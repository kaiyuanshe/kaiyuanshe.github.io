import { text2color } from 'idea-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { CommentBox } from '../../components/Base/CommentBox';
import { GroupCard } from '../../components/Department/Card';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Department, DepartmentModel } from '../../models/Personnel/Department';
import { Person, PersonModel } from '../../models/Personnel/Person';

export const getServerSideProps = compose<
  { name: string },
  { department: Department; person: Person; personnels: Personnel[] }
>(errorLogger, translator(i18n), async ({ params: { name } = {} }) => {
  const [department] = await new DepartmentModel().getList({ name });

  if (!department) return { notFound: true, props: {} };

  const [person] = await new PersonModel().getList({ name });

  const personnels = await new PersonnelModel().getList({
    department: name,
  });

  return {
    props: JSON.parse(JSON.stringify({ department, person, personnels })),
  };
});

export default class DepartmentDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderPersonnel = ({
    id,
    createdAt,
    type,
    department,
    position,
    award,
    applicants,
    reason,
  }: Personnel) => (
    <li key={id as string} className="mb-3">
      <details>
        <summary>
          <div className="d-inline-flex align-items-center gap-2">
            <time dateTime={new Date(createdAt as number).toJSON()}>
              {formatDate(createdAt as number, 'YYYY-MM-DD')}
            </time>
            <Badge bg={text2color(type + '', ['light'])}>{type + ''}</Badge>
            {award ? (
              <span>{award as string}</span>
            ) : (
              <>
                <span>{department as string}</span>
                <span>{position as string}</span>
              </>
            )}
          </div>
        </summary>

        <figure className="mt-3 px-3">
          <blockquote className="blockquote">
            <p>{reason as string}</p>
          </blockquote>
          {applicants && (
            <figcaption className="blockquote-footer">
              <cite>{(applicants as string[])[0]}</cite>
            </figcaption>
          )}
        </figure>
      </details>
    </li>
  );

  render() {
    const { department, person, personnels } = this.props;
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

            {/* Render the associated person */}
            {person && (
              <>
                <h3>{person.name as string}</h3>
                {/* Render additional person information as needed */}
              </>
            )}

            <hr className="my-5" />

            {/* Render department personnel */}
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
