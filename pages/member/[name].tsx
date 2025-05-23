import { text2color } from 'idea-react';
import { marked } from 'marked';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, errorLogger } from 'next-ssr-middleware';
import { Badge, Breadcrumb, Col, Container, Image, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { ActivityCard } from '../../components/Activity/Card';
import { ArticleCard } from '../../components/Article/Card';
import { CommentBox } from '../../components/Base/CommentBox';
import { LarkImage } from '../../components/Base/LarkImage';
import { TagNav } from '../../components/Base/TagNav';
import { CommunityCard } from '../../components/Community/CommunityCard';
import { GroupCard } from '../../components/Department/Card';
import { MeetingCard } from '../../components/Governance/MeetingCard';
import { PageHead } from '../../components/Layout/PageHead';
import { OrganizationCard } from '../../components/Organization/Card';
import { Activity, SearchActivityModel } from '../../models/Activity';
import { i18n, I18nContext } from '../../models/Base/Translation';
import { Community, SearchCommunityModel } from '../../models/Community';
import {
  Organization,
  SearchNGOModel,
  SearchOrganizationModel,
} from '../../models/Community/Organization';
import { Meeting, SearchMeetingModel } from '../../models/Governance/Meeting';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { Department, SearchDepartmentModel } from '../../models/Personnel/Department';
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

export const getServerSideProps = compose<{ name: string }, PersonDetailPage>(
  errorLogger,
  async ({ params: { name } = {} }) => {
    const [person] = await new PersonModel().getList({ name });

    if (!person) return { notFound: true, props: {} };

    const personnels = await new PersonnelModel().getList({
      passed: true,
      recipient: name,
    });

    const [departments, meetings, articles, activitys, communitys, organizations, NGOs] =
      await Promise.all([
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

    return { props: JSON.parse(JSON.stringify(searchResults)) };
  },
);

@observer
export default class PersonDetailPage extends ObservedComponent<
  PersonDetailPageProps,
  typeof i18n
> {
  static contextType = I18nContext;

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
        <li>{skills && <TagNav list={skills as string[]} />}</li>
        <li>🗺 {city as string}</li>
        <li>
          📬 <a href={`mailto:${email}`}>{email as string}</a>
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

  renderArticle(articles: Article[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('article'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {articles.map(article => (
            <Col key={article.id as string} as="li">
              <ArticleCard {...article} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  renderDepartment(departments: Department[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('department'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {departments.map(department => (
            <Col key={department.id as string} as="li">
              <GroupCard {...department} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  renderMeeting(meetings: Meeting[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('meeting'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {meetings.map(meeting => (
            <Col key={meeting.id as string} as="li">
              <MeetingCard {...meeting} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  renderActivity(activitys: Activity[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('activity'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {activitys.map(activity => (
            <Col key={activity.id as string} as="li">
              <ActivityCard {...activity} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  renderCommunity(communitys: Community[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('community'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {communitys.map(community => (
            <Col key={community.id as string} as="li">
              <CommunityCard {...community} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  renderOrganization = (organizations: Organization[]) => {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('organization'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {organizations.map(({ id, ...organization }) => (
            <Col key={id as string} as="li">
              <OrganizationCard {...organization} />
            </Col>
          ))}
        </Row>
      </details>
    );
  };

  renderNGO(NGOs: Organization[]) {
    const { t } = this.observedContext;

    return (
      <details>
        <summary>{textJoin(t('related'), t('NGO'))}</summary>

        <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
          {NGOs.map(({ id, ...NGO }) => (
            <Col key={id as string} as="li">
              <OrganizationCard {...NGO} />
            </Col>
          ))}
        </Row>
      </details>
    );
  }

  render() {
    const { t } = this.observedContext;
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
