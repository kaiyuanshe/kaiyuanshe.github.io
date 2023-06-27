import { PureComponent } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { Container, Row, Col } from 'react-bootstrap';
import { ScrollList } from 'mobx-restful-table';

import { i18n } from '../../../models/Translation';
import PageHead from '../../../components/PageHead';
import { CommentBox } from '../../../components/CommentBox';
import { ArticleListLayout } from '../../../components/Article/List';
import {
  Article,
  ArticleModel,
  SearchArticleModel,
} from '../../../models/Article';
import { withErrorLog } from '../../api/base';
import { SearchActivityModel } from '../../../models/Activity';

export const getServerSideProps = withErrorLog<
  { id: string },
  { article: Article; recommends: Article[] }
>(async ({ params }) => {
  const articleStore = new ArticleModel();

  const article = await articleStore.getOne(params!.id);

  return {
    props: {
      article,
      recommends: articleStore.currentRecommend!.currentPage,
    },
  };
});

export default class ArticleDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderAuthorization() {
    const { license = 'CC-4.0' } = this.props.article;

    return (
      <>
        <p className="text-muted mt-3 small">版权声明：{license}</p>
      </>
    );
  }

  render() {
    const { title, content, tags } = this.props.article,
      { recommends } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={title + ''} />

        <Row>
          <Col
            as="article"
            xs={12}
            sm={9}
            dangerouslySetInnerHTML={{ __html: content! }}
          />
          <Col xs={12} sm={3}>
            {this.renderAuthorization()}

            <ScrollList
              translator={i18n}
              store={new SearchArticleModel()}
              filter={{ tags: (tags + '').split(/\s+/) }}
              renderList={allItems => (
                <ArticleListLayout defaultData={allItems} rowCols={{ xs: 1 }} />
              )}
              defaultData={recommends}
            />
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
