import { PureComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Badge, Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { TimeDistance, Icon, Nameplate, EditorHTML } from 'idea-react';

import { TimeOption } from '../../../components/data';
import PageHead from '../../../components/PageHead';
import SearchBar from '../../../components/SearchBar';
import ArticleRecommend from '../../../components/ArticleRecommend';

import { DataBox, call } from '../../api/base';
import { Article } from '../../api/article';

export async function getServerSideProps({
  params,
  req,
}: GetServerSidePropsContext<{ id: string }>) {
  const { data } = params!.id
    ? await call<DataBox<Article>>(`articles/${params!.id}`, 'GET', null, {
        req,
      })
    : ({} as DataBox<Article>);

  return { props: data };
}

const { NEXT_PUBLIC_API_HOST } = process.env;

export default class ArticleDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderAuthorization() {
    const { author, license, files } = this.props;

    return (
      <>
        <a href={`/user/${author?.id}`}>
          <Nameplate
            avatar={author?.avatar?.url || '/typescript.png'}
            name={author?.username || ''}
          />
        </a>
        <p className="text-muted mt-3 small">版权声明：{license}</p>

        {files?.map(({ name, url }) => (
          <Button
            key={url}
            className="w-100 mt-3"
            variant="primary"
            href={new URL(url, NEXT_PUBLIC_API_HOST) + ''}
          >
            下载 {name}
          </Button>
        ))}
      </>
    );
  }

  renderContent() {
    const { title, publishedAt, tags, image, summary, content } = this.props;

    return (
      <>
        <h1>{title}</h1>
        <aside className="my-3">
          <Icon className="me-2" name="clock" />
          <TimeDistance className="me-3" {...TimeOption} date={publishedAt!} />

          {tags?.map(({ name }) => (
            <Badge
              key={name}
              className="me-2"
              color="primary"
              as="a"
              href={`/article?tag=${name}`}
            >
              {name}
            </Badge>
          ))}
        </aside>

        <img
          className="d-block w-100"
          style={{ height: '30vh', objectFit: 'cover' }}
          src={image && new URL(image.url || '', NEXT_PUBLIC_API_HOST) + ''}
          alt={image?.alternativeText}
        />
        {summary && (
          <blockquote
            className="mt-3"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        )}
        <article
          className="mt-3"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  }

  render() {
    const { id, title, tags = [] } = this.props;

    return (
      <Container className="my-4">
        <PageHead title={title} />

        <SearchBar />

        <Row>
          <Col xs={12} sm={9}>
            {this.renderContent()}
          </Col>
          <Col xs={12} sm={3}>
            {this.renderAuthorization()}

            <ArticleRecommend articles={[id]} tags={tags.map(({ id }) => id)} />
          </Col>
        </Row>
      </Container>
    );
  }
}
