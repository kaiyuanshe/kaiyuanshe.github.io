import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { ArticleListLayout } from '../../../components/Article/List';
import { CommentBox } from '../../../components/CommentBox';
import PageHead from '../../../components/PageHead';
import { Article, ArticleModel } from '../../../models/Product/Article';

export const getServerSideProps = compose<
  { id: string },
  { article: Article; recommends: Article[] }
>(errorLogger, async ({ params }) => {
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

            <ArticleListLayout defaultData={recommends} rowCols={{ xs: 1 }} />
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
