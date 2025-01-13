import { observer } from 'mobx-react';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { ArticleListLayout } from '../../../components/Article/List';
import { CommentBox } from '../../../components/Base/CommentBox';
import { TagNav } from '../../../components/Base/TagNav';
import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, t } from '../../../models/Base/Translation';
import { Article, ArticleModel } from '../../../models/Product/Article';

interface ArticleDetailPageProps {
  article: Article;
  recommends: Article[];
}

export const getServerSideProps = compose<
  { id: string },
  ArticleDetailPageProps
>(errorLogger, translator(i18n), async ({ params }) => {
  const articleStore = new ArticleModel();

  const article = await articleStore.getOne(params!.id);

  return {
    props: {
      article,
      recommends: articleStore.currentRecommend!.currentPage,
    },
  };
});

@observer
export default class ArticleDetailPage extends Component<ArticleDetailPageProps> {
  renderMeta() {
    const { license = 'CC-4.0', link, tags } = this.props.article;

    return (
      <>
        <dl className="small text-muted">
          <dt>{t('copyright')}</dt>
          <dd>{license as string}</dd>
          <dt>{t('original_link')}</dt>
          <dd>
            <a target="_blank" href={link + ''} rel="noreferrer">
              {link as string}
            </a>
          </dd>
        </dl>

        <TagNav
          linkOf={value => `/search/article?keywords=${value}`}
          list={tags as string[]}
        />
      </>
    );
  }

  render() {
    const { title, content } = this.props.article,
      { recommends } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={title as string} />

        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/article">{t('article')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{title as string}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col
            as="article"
            xs={12}
            sm={9}
            dangerouslySetInnerHTML={{ __html: content! }}
          />
          <Col xs={12} sm={3}>
            {this.renderMeta()}

            <ArticleListLayout defaultData={recommends} rowCols={{ xs: 1 }} />
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
