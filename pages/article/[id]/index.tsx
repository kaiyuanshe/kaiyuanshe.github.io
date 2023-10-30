import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { ArticleListLayout } from '../../../components/Article/List';
import { CommentBox } from '../../../components/Base/CommentBox';
import { TagNav } from '../../../components/Base/TagNav';
import PageHead from '../../../components/Layout/PageHead';
import { i18n } from '../../../models/Base/Translation';
import { Article, ArticleModel } from '../../../models/Product/Article';

export const getServerSideProps = compose<
  { id: string },
  { article: Article; recommends: Article[] }
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

const { t } = i18n;

export default class ArticleDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderMeta() {
    const { license = 'CC-4.0', link, tags } = this.props.article;

    return (
      <>
        <ul className="list-unstyled small text-muted d-flex flex-column gap-3">
          <li>版权声明：{license as string}</li>
          <li>
            原文链接：
            <a target="_blank" href={link + ''} rel="noreferrer">
              {link as string}
            </a>
          </li>
        </ul>

        <TagNav list={tags as string[]} />
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
