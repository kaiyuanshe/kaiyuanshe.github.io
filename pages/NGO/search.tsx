import { observer } from 'mobx-react';
import {
  cache,
  compose,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { SearchBar } from '../../components/Base/SearchBar';
import { PageHead } from '../../components/Layout/PageHead';
import { OrganizationListLayout } from '../../components/Organization/List';
import { i18n, t } from '../../models/Base/Translation';
import {
  NGO_BASE_ID,
  NGO_TABLE_ID,
  Organization,
  SearchOrganizationModel,
} from '../../models/Community/Organization';
import { SearchQuery } from '../api/search';

interface NGOSearchProps extends RouteProps {
  organizations: Organization[];
}

export const getServerSideProps = compose<{}, NGOSearchProps>(
  cache(),
  router,
  translator(i18n),
  async ({ query }) => {
    const { tag, keywords } = query as SearchQuery;
    const keywordList = keywords?.split(/\s+/);

    const organizations = await new SearchOrganizationModel(
      NGO_BASE_ID,
      NGO_TABLE_ID,
    ).getAll({
      name: keywordList,
      tags: tag,
      summary: keywordList,
      city: keywordList,
      link: keywordList,
      codeLink: keywordList,
      wechatName: keywordList,
    });

    return { props: JSON.parse(JSON.stringify({ organizations })) };
  },
);

const NGOSearchPage: FC<NGOSearchProps> = observer(
  ({ route, organizations }) => {
    const { tag, keywords } = route.query as SearchQuery;

    const title = `${tag ? t('tag') : t('keyword')} ${tag || keywords} ${t(
      'search_results',
    )} - ${t('China_NGO_Map')}`;

    return (
      <Container className="my-5">
        <PageHead title={title} />

        <h1 className="text-center">{title}</h1>

        <SearchBar className="my-4" action="/NGO/search" />

        <OrganizationListLayout defaultData={organizations} />
      </Container>
    );
  },
);
export default NGOSearchPage;
