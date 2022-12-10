import { buildURLData } from 'web-utility';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import { ActivityListLayout } from '../../components/Activity/List';
import { MemberList } from '../../components/Member/List';
import { GroupCard } from '../../components/Group/Card';
import { OrganizationListLayout } from '../../components/Organization/List';

import { i18n } from '../../models/Translation';
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

const { t } = i18n;
  return (
    <Container className="my-5">
      <h1 className="text-center">{t('search_results')}</h1>
      <h2>{t('article')}</h2>
      <ArticleListLayout data={articles} />
      <h2>{t('member')}</h2>
      <MemberList list={members} />
      <h2>{t('department')}</h2>
      <Row className="my-0 g-4" xs={1} sm={2} md={4}>
        {groups.map(group => (
          <Col key={group.id + ''}>
            <GroupCard className="h-100 border rounded-3 p-3" {...group} />
          </Col>
        ))}
      </Row>
      <h2>{t('organization_short')}</h2>
      <OrganizationListLayout data={organizations} />
    </Container>
  );
};

export default SearchPage;
