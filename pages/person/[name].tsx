import { text2color } from 'idea-react';
import { marked } from 'marked';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Badge, Col, Container, Image, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import PageHead from '../../components/PageHead';
import { Person, PersonModel } from '../../models/Person';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { withErrorLog, withTranslation } from '../api/base';

export const getServerSideProps = withErrorLog<
  { name: string },
  { person: Person; personnels: Personnel[] }
>(
  withTranslation(async ({ params: { name } = {} }) => {
    const [person] = await new PersonModel().getList({ name });

    if (!person) return { notFound: true, props: {} };

    const personnels = await new PersonnelModel().getList({
      passed: true,
      recipient: name,
    });

    return {
      props: JSON.parse(JSON.stringify({ person, personnels })),
    };
  }),
);

export default class PersonDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderProfile = ({
    name,
    gender,
    city,
    email,
    website,
    github = 'https://github.com/kaiyuanshe',
    skills,
  }: Person) => (
    <>
      <Image fluid src={`${github}.png`} />

      <h1>{name}</h1>
      <ul>
        <li>
          <Badge bg={text2color(gender as string, ['light'])}>{gender}</Badge>
        </li>
        <li>
          {(skills as string[]).map(skill => (
            <Badge
              key={skill}
              className="me-2"
              bg={text2color(skill, ['light'])}
            >
              {skill}
            </Badge>
          ))}
        </li>
        <li>🗺 {city}</li>
        <li>
          📬 <a href={email as string}>{(email as string).split(':')[1]}</a>
        </li>
        <li>
          🖥{' '}
          <a target="_blank" href={website as string} rel="noreferrer">
            {website}
          </a>
        </li>
        <li>
          ⌨{' '}
          <a target="_blank" href={github as string} rel="noreferrer">
            {github}
          </a>
        </li>
      </ul>
    </>
  );

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
            <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
            {award ? (
              <span>{award}</span>
            ) : (
              <>
                <span>{department}</span>
                <span>{position}</span>
              </>
            )}
          </div>
        </summary>

        <figure className="mt-3 px-3">
          <blockquote className="blockquote">
            <p>{reason}</p>
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
    const { person, personnels } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={person.name as string} />

        <Row>
          <Col xs={12} sm={4}>
            {this.renderProfile(person)}
          </Col>
          <Col xs={12} sm={8} as="ol" className="list-unstyled">
            {person.summary && (
              <article
                dangerouslySetInnerHTML={{
                  __html: marked(person.summary as string),
                }}
              />
            )}
            <hr className="my-5" />

            {personnels.map(this.renderPersonnel)}
          </Col>
        </Row>
      </Container>
    );
  }
}
