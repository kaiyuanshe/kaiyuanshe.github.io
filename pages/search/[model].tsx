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
import { Col, Container, Row } from 'react-bootstrap';

import { MeetingCard } from '../../components/Governance/MeetingCard';
import { PageHead } from '../../components/Layout/PageHead';
import { LarkBase } from '../../models/Base';
import systemStore from '../../models/Base/System';
import { i18n, t } from '../../models/Base/Translation';

interface SearchModelPageProps extends RouteProps<{ model: string }> {
  list: LarkBase[];
}

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
    const list = await new Model().getSearchList(keywords + '', +page);

    return {
      props: JSON.parse(JSON.stringify({ list })) as SearchModelPageProps,
    };
  },
);

const SearchNameMap: () => Record<string, string> = () => ({
  meeting: t('meeting_calendar'),
});

const SearchCardMap: Record<string, ComponentClass<any> | FC<any>> = {
  meeting: MeetingCard,
};

const SearchModelPage: FC<SearchModelPageProps> = observer(
  ({ route: { params, query }, list }) => {
    const name = SearchNameMap()[params!.model],
      Card = SearchCardMap[params!.model];
    const title = `${query.keywords} - ${name} ${t('search_results')}`;

    return (
      <Container className="py-4">
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <Row className="g-3" xs={1} sm={2} md={3}>
          {list.map(item => (
            <Col key={item.id as string}>
              <Card {...item} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  },
);
export default SearchModelPage;
