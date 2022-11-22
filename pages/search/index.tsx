import { buildURLData } from 'web-utility';
import { InferGetServerSidePropsType } from 'next';
import { Container, Row, Col } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import { ActivityListLayout } from '../../components/Activity/List';
import { MemberList } from '../../components/Member/List';
import { GroupCard } from '../../components/Group/Card';
import { OrganizationListLayout } from '../../components/Organization/List';

import { client } from '../../models/Base';
import { withRoute } from '../api/base';
import { SearchResult } from '../api/search';

export const getServerSideProps = withRoute<{}, SearchResult>(
  async ({ query }) => {
    const { body } = await client.get<SearchResult>(
      `search?${buildURLData(query)}`,
    );
    return { props: body! };
  },
);

export default function SearchPage({
  activities,
  articles,
  members,
  groups,
  organizations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="my-5">
      <h1 className="text-center">搜索结果</h1>

      <h2>文章</h2>

      <ArticleListLayout data={articles} />

      <h2>活动</h2>

      <ActivityListLayout data={activities} />

      <h2>成员</h2>

      <MemberList list={members} />

      <h2>部门</h2>

      <Row className="my-0 g-4" xs={1} sm={2} md={4}>
        {groups.map(group => (
          <Col key={group.id + ''}>
            <GroupCard className="h-100 border rounded-3 p-3" {...group} />
          </Col>
        ))}
      </Row>

      <h2>组织</h2>

      <OrganizationListLayout data={organizations} />
    </Container>
  );
}
