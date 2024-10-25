import { text2color } from 'idea-react';
import { marked } from 'marked';
import { observer } from 'mobx-react';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Badge, Breadcrumb, Col, Container, Image, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { CommentBox } from '../../components/Base/CommentBox';
import { LarkImage } from '../../components/Base/LarkImage';
import { PageHead } from '../../components/Layout/PageHead';
import systemStore from '../../models/Base/System';
import { i18n, t } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Person, PersonModel } from '../../models/Personnel/Person';
interface PersonDetailPageProps {
  person: Person;
  personnels: Personnel[];
  [key: string]: any;
}

const SEARCH_TYPES = [
  'member',
  'department',
  'meeting',
  'article',
  'activity',
  'community',
  'organization',
  'NGO',
] as const;

export const getServerSideProps = compose<{ name: string }, PersonDetailPage>(
  errorLogger,
  translator(i18n),
  async ({ params: { name } = {} }) => {
    const [person] = await new PersonModel().getList({ name });

    if (!person) return { notFound: true, props: {} };

    const personnels = await new PersonnelModel().getList({
      passed: true,
      recipient: name,
    });

    const [
      member,
      department,
      meeting,
      article,
      activity,
      community,
      organization,
      NGO
    ] = await Promise.all([
      new systemStore.searchMap.member().getSearchList(name + ''),
      new systemStore.searchMap.department().getSearchList(name + ''),
      new systemStore.searchMap.meeting().getSearchList(name + ''),
      new systemStore.searchMap.article().getSearchList(name + ''),
      new systemStore.searchMap.activity().getSearchList(name + ''),
      new systemStore.searchMap.community().getSearchList(name + ''),
      new systemStore.searchMap.organization().getSearchList(name + ''),
      new systemStore.searchMap.NGO().getSearchList(name + '')
    ]);

    
    return {
      props: JSON.parse(
        JSON.stringify({
          person,
          personnels,
          member,
          department,
          meeting,
          article,
          activity,
          community,
          organization,
          NGO,
        }),
      ),
    };
  },
);

@observer
export default class PersonDetailPage extends Component<PersonDetailPageProps> {
  renderProfile = ({
    name,
    gender,
    avatar,
    city,
    email,
    website,
    github = 'https://github.com/kaiyuanshe',
    skills,
  }: Person) => (
    <>
      {avatar ? (
        <LarkImage src={avatar} />
      ) : (
        <Image src={`${github}.png`} alt="GitHub profile image" fluid />
      )}

      <h1>{name as string}</h1>
      <ul>
        <li>
          <Badge bg={text2color(gender + '', ['light'])}>{gender + ''}</Badge>
        </li>
        {skills && (
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
        )}
        <li>🗺 {city as string}</li>
        <li>
          📬 <a href={email as string}>{(email as string)?.split(':')[1]}</a>
        </li>
        <li>
          🖥{' '}
          <a target="_blank" href={website as string} rel="noreferrer">
            {website as string}
          </a>
        </li>
        <li>
          ⌨{' '}
          <a target="_blank" href={github as string} rel="noreferrer">
            {github as string}
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

  renderMember = ({ organization, }: typeof systemStore.searchMap['member']) => (
    <>{JSON.stringify(member)}</>)
    ;

  render() {
    const { person,
      personnels,
      member,
      department,
      meeting,
      article,
      activity,
      community,
      organization,
      NGO,
    } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={person.name as string} />

        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/member">{t('member')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{person.name as string}</Breadcrumb.Item>
        </Breadcrumb>

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
            <>{JSON.stringify(member)}</>
            <p>department</p>
            <>{JSON.stringify(department)}</>
            <p>meeting</p>
            <>{JSON.stringify(meeting)}</>
            <p>article</p>
            <>{JSON.stringify(article)}</>
            <p>activity</p>
            <>{JSON.stringify(activity)}</>
            <p>community</p>
            <>{JSON.stringify(community)}</>
            <p>organization</p>
            <>{JSON.stringify(organization)}</>
            <p>NGO</p>
            <>{JSON.stringify(NGO)}</>
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
