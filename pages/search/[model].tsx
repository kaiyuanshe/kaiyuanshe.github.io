import { BiSearchModelClass } from 'mobx-lark';
import { observer } from 'mobx-react';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { ComponentClass, FC } from 'react';
import { Col, Container, Nav, Pagination, Row } from 'react-bootstrap';
import { buildURLData } from 'web-utility';

import { ActivityCard } from '../../components/Activity';
import { ArticleCard } from '../../components/Article/Card';
import { SearchBar } from '../../components/Base/SearchBar';
import { CommunityCard } from '../../components/Community/CommunityCard';
import { GroupCard } from '../../components/Department/Card';
import { MeetingCard } from '../../components/Governance/MeetingCard';
import { PageHead } from '../../components/Layout/PageHead';
import { MemberCard } from '../../components/Member/Card';
import { OrganizationCard } from '../../components/Organization/Card';
import systemStore from '../../models/Base/System';
import { i18n, t } from '../../models/Base/Translation';

type SearchModelPageProps = RouteProps<{ model: string }> &
  Pick<
    InstanceType<BiSearchModelClass>,
    'pageIndex' | 'currentPage' | 'pageCount'
  >;

export const getServerSideProps = compose<
  { model: string },
  SearchModelPageProps
>(
  cache(),
  router,
  errorLogger,
  translator(i18n),
  async ({ params, query: { keywords, page = '1' } }) => {
    const Model = systemStore.searchMap[params!.model];

    if (typeof Model !== 'function') return { notFound: true };

    const store = new Model();

    await store.getSearchList(keywords + '', +page, 9);

    const { pageIndex, currentPage, pageCount } = store;

    return {
      props: JSON.parse(
        JSON.stringify({ pageIndex, currentPage, pageCount }),
      ) as SearchModelPageProps,
    };
  },
);

const SearchNameMap: () => Record<string, string> = () => ({
  member: t('member'),
  department: t('department'),
  meeting: t('meeting_calendar'),
  article: t('article'),
  activity: t('activity'),
  community: t('community'),
  organization: t('organization'),
  NGO: t('China_NGO_Map'),
});

const SearchCardMap: Record<string, ComponentClass<any> | FC<any>> = {
  member: MemberCard,
  department: GroupCard,
  meeting: MeetingCard,
  article: ArticleCard,
  activity: ActivityCard,
  community: CommunityCard,
  organization: OrganizationCard,
  NGO: OrganizationCard,
};

const SearchModelPage: FC<SearchModelPageProps> = observer(
  ({ route: { params, query }, currentPage, pageIndex, pageCount }) => {
    const nameMap = SearchNameMap(),
      { model } = params!,
      { keywords } = query;
    const name = nameMap[model],
      Card = SearchCardMap[model];
    const title = `${keywords} - ${name} ${t('search_results')}`;

    return (
      <Container className="py-4">
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <header className="d-flex flex-wrap align-items-center gap-3">
          <SearchBar
            className="flex-fill"
            action={`/search/${model}`}
            defaultValue={keywords}
          />
          <Nav variant="pills" defaultActiveKey={model}>
            {Object.entries(nameMap).map(([key, value]) => (
              <Nav.Item key={key}>
                <Nav.Link
                  eventKey={key}
                  href={`/search/${key}?keywords=${keywords}`}
                >
                  {value}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </header>

        <Row className="g-3 my-4" xs={1} sm={2} md={3}>
          {currentPage.map(item => (
            <Col key={item.id as string}>
              <Card {...item} />
            </Col>
          ))}
        </Row>

        <Pagination className="justify-content-center" size="lg">
          <Pagination.Prev
            href={`/search/${model}?${buildURLData({ keywords, page: pageIndex - 1 })}`}
            disabled={pageIndex === 1}
          />
          <Pagination.Next
            href={`/search/${model}?${buildURLData({ keywords, page: pageIndex + 1 })}`}
            disabled={pageIndex === pageCount}
          />
        </Pagination>
      </Container>
    );
  },
);
export default SearchModelPage;
