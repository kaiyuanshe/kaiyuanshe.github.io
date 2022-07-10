import { stringify } from 'qs';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Container, Row, Col } from 'react-bootstrap';
import { PaginationBar } from 'idea-react';

import PageHead from '../../components/PageHead';
import UserCard from '../../components/UserCard';
import SearchBar from '../../components/SearchBar';
import { SearchScope } from '../../components/data';

import { makeSearch, mergeQuery, getPageV3 } from '../api/base';
import type { User } from '../api/user';

export async function getServerSideProps({
  req,
  query: { keywords = '', pageIndex = '1', pageSize = '10' },
}: GetServerSidePropsContext) {
  const search = keywords && makeSearch<User>(['username'], keywords as string);

  const data = await getPageV3<User>(
    mergeQuery(`users?${search || ''}`, { sort: 'updatedAt:desc' }),
    { req },
    +pageIndex,
    +pageSize,
  );
  return { props: { keywords, ...data } };
}

export default function UserListPage({
  keywords,
  pageIndex,
  pageSize,
  pageCount,
  list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = keywords && `设计师关键词：${keywords}`;

  return (
    <Container>
      <PageHead title={title} />

      <SearchBar scope={SearchScope.User} />

      <h1 className="mt-4">{title}</h1>

      <Row as="section" xs={1} sm={3} md={4} className="g-3 my-4">
        {list.map(user => (
          <Col key={user.id}>
            <UserCard className="h-100" {...user} />
          </Col>
        ))}
      </Row>

      <PaginationBar
        currentPage={pageIndex}
        pageCount={pageCount}
        onChange={pageIndex =>
          (location.href = `user?${stringify({
            keywords: keywords || undefined,
            pageIndex,
            pageSize,
          })}`)
        }
      />
    </Container>
  );
}
