import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import { ActivityListLayout } from '../../components/Activity/List';
import { MemberList } from '../../components/Member/List';
import { GroupCard } from '../../components/Group/Card';
import { OrganizationListLayout } from '../../components/Organization/List';

import { SystemModel } from '../../models/System';
import { i18n } from '../../models/Translation';
import { withRoute, withTranslation } from '../api/base';
import { SearchResult } from '../api/search';

export const getServerSideProps = withTranslation(
  withRoute<{}, SearchResult>(async ({ query }) => {
    const props = await new SystemModel().search(query);

    return {
      props: JSON.parse(JSON.stringify(props)),
    };
  }),
);

const SearchPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ articles, activities, members, groups, organizations }) => {
    const { t } = i18n;

    return (
      <Container className="my-5">
        <h1 className="text-center">{t('search_results')}</h1>

        <h2>{t('article')}</h2>

        <ArticleListLayout data={articles} />

        <h2>{t('activity')}</h2>

        <ActivityListLayout data={activities} />

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
  });

export default SearchPage;
