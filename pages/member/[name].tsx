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
import { Activity,SearchActivityModel } from '../../models/Activity';
import systemStore from '../../models/Base/System';
import { i18n, t } from '../../models/Base/Translation';
import { Community,SearchCommunityModel } from '../../models/Community';
import { SearchNGOModel } from '../../models/Community/Organization';
import {
  Organization,
  SearchOrganizationModel,
} from '../../models/Community/Organization';
import { Meeting,SearchMeetingModel } from '../../models/Governance/Meeting';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import {
  Department,
  SearchDepartmentModel,
} from '../../models/Personnel/Department';
import { Person, PersonModel } from '../../models/Personnel/Person';
import { Article, SearchArticleModel } from '../../models/Product/Article';
interface PersonDetailPageProps {
  person: Person;
  personnels: Personnel[];
  articles: Article[];
  departments: Department[];
  meetings: Meeting[];
  activitys: Activity[];
  communitys: Community[];
  organizations: Organization[];
  NGOs: Organization[];
}

const SEARCH_TYPES = [
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
      departments,
      meetings,
      articles,
      activitys,
      communitys,
      organizations,
      NGOs,
    ] = await Promise.all([
      new SearchDepartmentModel().getSearchList(name + ''),
      new SearchMeetingModel().getSearchList(name + ''),
      new SearchArticleModel().getSearchList(name + ''),
      new SearchActivityModel().getSearchList(name + ''),
      new SearchCommunityModel().getSearchList(name + ''),
      new SearchOrganizationModel().getSearchList(name + ''),
      new SearchNGOModel().getSearchList(name + ''),
    ]);

    const searchResults = {
      person,
      personnels,
      departments,
      meetings,
      articles,
      activitys,
      communitys,
      organizations,
      NGOs,
    };

    return {
      props: JSON.parse(JSON.stringify(searchResults)),
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

  renderArticle = (articles: Article[]) => (
    <li className="mb-3">
      <details>
        <summary>相关著作</summary>
        <ul>
          {articles.map(article => (
            <li key={article.id as string}>
              <a
                href={article.link as string}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.title as string}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
  renderDepartment = (departments: Department[]) => (
    <li className="mb-3">
      <details>
        <summary>相关部门</summary>
        <ul>
          {departments.map(department => (
            <li key={department.id as string}>{department.name as string}</li>
          ))}
        </ul>
      </details>
    </li>
  );

  renderMeeting = (meetings: Meeting[]) => (
    <li className="mb-3">
      <details>
        <summary>相关会议</summary>
        <ul>
          {meetings.map(meeting => (
            <li key={meeting.id as string}>{meeting.name as string}</li>
          ))}
        </ul>
      </details>
    </li>
  );

  renderActivity = (activitys: Activity[]) => (
    <li className="mb-3">
      <details>
        <summary>相关活动</summary>
        <ul>
          {activitys.map(activity => (
            <li key={activity.id as string}>
              <a
                href={activity.link as string}
                target="_blank"
                rel="noreferrer"
              >
                {activity.name as string}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );

  renderCommunity = (communitys: Community[]) => (
    <li className="mb-3">
      <details>
        <summary>相关社区</summary>
        <ul>
          {communitys.map(community => (
            <li key={community.id as string}>
              <a
                href={community.link as string}
                target="_blank"
                rel="noreferrer"
              >
                {community.name as string}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );

  renderOrganization = (organizations: Organization[]) => (
    <li className="mb-3">
      <details>
        <summary>相关组织</summary>
        <ul>
          {organizations.map(organization => (
            <li key={organization.id as string}>
              <a
                href={organization.link as string}
                target="_blank"
                rel="noreferrer"
              >
                {organization.name as string}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );

  renderNGO = (NGOs: Organization[]) => (
    <li className="mb-3">
      <details>
        <summary>相关NGO</summary>
        <ul>
          {NGOs.map(NGO => (
            <li key={NGO.id as string}>
              <a href={NGO.link as string} target="_blank" rel="noreferrer">
                {NGO.name as string}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );

  render() {
    const {
      person,
      personnels,
      departments,
      meetings,
      articles,
      activitys,
      communitys,
      organizations,
      NGOs,
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
            {articles.length > 0 && this.renderArticle(articles)}
            {departments.length > 0 && this.renderDepartment(departments)}
            {meetings.length > 0 && this.renderMeeting(meetings)}
            {activitys.length > 0 && this.renderActivity(activitys)}
            {communitys.length > 0 && this.renderCommunity(communitys)}
            {organizations.length > 0 && this.renderOrganization(organizations)}
            {NGOs.length > 0 && this.renderNGO(NGOs)}
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
