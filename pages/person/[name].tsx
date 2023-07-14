import { text2color } from 'idea-react';
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

    const personnels = await new PersonnelModel().getList({ recipient: name });

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
    summary,
  }: Person) => (
    <>
      <Image src={`${github}.png`} />

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
      <article>{summary}</article>
    </>
  );

  renderPersonnel = ({
    id,
    createdAt,
    type,
    department,
    position,
    award,
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

        {reason}
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
            {personnels.map(this.renderPersonnel)}
          </Col>
        </Row>
      </Container>
    );
  }
}
