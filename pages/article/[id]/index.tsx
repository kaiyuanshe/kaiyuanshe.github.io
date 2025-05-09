import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, errorLogger } from 'next-ssr-middleware';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { ArticleListLayout } from '../../../components/Article/List';
import { CommentBox } from '../../../components/Base/CommentBox';
import { TagNav } from '../../../components/Base/TagNav';
import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import { Article, ArticleModel } from '../../../models/Product/Article';

interface ArticleDetailPageProps {
  article: Article;
  recommends: Article[];
}

export const getServerSideProps = compose<{ id: string }, ArticleDetailPageProps>(
  errorLogger,
  async ({ params }) => {
    const articleStore = new ArticleModel();

    const article = await articleStore.getOne(params!.id);

    return {
      props: {
        article,
        recommends: articleStore.currentRecommend!.currentPage,
      },
    };
  },
);

@observer
export default class ArticleDetailPage extends ObservedComponent<
  ArticleDetailPageProps,
  typeof i18n
> {
  static contextType = I18nContext;

  renderMeta() {
    const { t } = this.observedContext,
      { license = 'CC-4.0', link, tags } = this.props.article;

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

        <TagNav linkOf={value => `/search/article?keywords=${value}`} list={tags as string[]} />
      </>
    );
  }

  render() {
    const { t } = this.observedContext,
      { title, content } = this.props.article,
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
          <Col as="article" xs={12} sm={9} dangerouslySetInnerHTML={{ __html: content! }} />
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
