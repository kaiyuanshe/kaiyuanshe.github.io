import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { ActivityListLayout } from '../../components/Activity/List';
import { ArticleListLayout } from '../../components/Article/List';
import { GroupCard } from '../../components/Group/Card';
import { MemberCard } from '../../components/Member/Card';
import { OrganizationListLayout } from '../../components/Organization/List';
import PageHead from '../../components/PageHead';
import { SystemModel } from '../../models/System';
import { i18n } from '../../models/Translation';
import { withRoute, withTranslation } from '../api/base';
import { SearchQuery, SearchResult } from '../api/search';

export const getServerSideProps = withTranslation(
  withRoute<{}, SearchResult>(async ({ query }) => {
    const props = await new SystemModel().search(query);

    return {
      props: JSON.parse(JSON.stringify(props)),
    };
  }),
);

const SearchPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(
    ({
      route,
      articles = [],
      activities = [],
      people = [],
      departments = [],
      organizations = [],
    }) => {
      const { t } = i18n,
        { tag, keywords } = route.query as SearchQuery;
      const title = `${tag ? t('tag') : t('keyword')} ${tag || keywords} ${t(
        'search_results',
      )}`;

      return (
        <Container className="my-5">
          <PageHead title={title} />

          <h1 className="text-center">{title}</h1>

          <h2>{t('article')}</h2>

          <ArticleListLayout defaultData={articles} />

          <h2>{t('activity')}</h2>

          <ActivityListLayout defaultData={activities} />

          <h2>{t('member')}</h2>

          <Row className="my-0 g-4 text-center" xs={1} sm={2} md={4}>
            {people.map(({ id, name, github }) => (
              <Col key={id + ''}>
                <MemberCard name={name as string} avatar={github as string} />
              </Col>
            ))}
          </Row>

          <h2>{t('department')}</h2>

          <Row className="my-0 g-4" xs={1} sm={2} md={4}>
            {departments.map(group => (
              <Col key={group.id + ''}>
                <GroupCard className="h-100 border rounded-3 p-3" {...group} />
              </Col>
            ))}
          </Row>

          <h2>{t('organization_short')}</h2>

          <OrganizationListLayout defaultData={organizations} />
        </Container>
      );
    },
  );

export default SearchPage;
