import 'array-unique-proposal';
import { stringify } from 'qs';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Container, Row, Col } from 'react-bootstrap';
import { PaginationBar } from 'idea-react';

import PageHead from '../../components/PageHead';
import SearchBar from '../../components/SearchBar';
import ArticleCard from '../../components/ArticleCard';
import ArticleRecommend from '../../components/ArticleRecommend';

import { makeSearch, mergeQuery, getPage } from '../api/base';
import { Article } from '../api/article';

export async function getServerSideProps({
  req,
  query: { tag, author, keywords = '', pageIndex = '1', pageSize = '10' },
}: GetServerSidePropsContext) {
  const search =
    keywords && makeSearch<Article>(['title', 'content'], keywords as string);

  const data = await getPage<Article>(
    mergeQuery(`articles?${search || ''}`, {
      'author.id': author,
      'tags.name': tag,
      sort: 'updatedAt:desc',
    }),
    { req },
    +pageIndex,
    +pageSize,
  );
  return {
    props: {
      tag: tag || '',
      author: author || '',
      keywords,
      ...data,
    },
  };
}

export default function ArticleListPage({
  tag,
  author,
  keywords,
  pageIndex,
  pageSize,
  pageCount,
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = tag
    ? `文章标签：${tag}`
    : author
    ? list[0]
      ? `${list[0].author?.username}的文章`
      : '用户暂无文章'
    : keywords && `文章关键词：${keywords}`;

  return (
    <Container>
      <PageHead title={title} />

      <SearchBar />

      <Row>
        <Col xs={keywords ? 9 : 12}>
          <h1 className="mt-4">{title}</h1>

          <Row as="section" xs={1} sm={3} className="g-3 my-4">
            {list.map(item => (
              <Col key={item.id}>
                <ArticleCard className="h-100" {...item} />
              </Col>
            ))}
          </Row>

          <PaginationBar
            currentPage={pageIndex}
            pageCount={pageCount}
            onChange={pageIndex =>
              (location.href = `/article?${stringify({
                tag: tag || undefined,
                keywords: keywords || undefined,
                pageIndex,
                pageSize,
              })}`)
            }
          />
        </Col>

        {keywords && (
          <ArticleRecommend
            className="col-3"
            articles={list.map(({ id }) => id)}
            tags={list
              .map(({ tags = [] }) => tags.map(({ id }) => id))
              .flat()
              .uniqueBy()
              .slice(0, 5)}
          />
        )}
      </Row>
    </Container>
  );
}
