import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import repositoryStore, { RepositoryModel } from '../models/Repository';
import { i18n } from '../models/Translation';

export const getServerSideProps = compose(
  errorLogger,
  translator(i18n),
  async () => {
    const list = await new RepositoryModel().getList();
    return { props: { list } };
  },
);

const ScrollListPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ list }) => (
  <Container>
    <PageHead title="开源社项目" />
    <h1 className="my-4">开源社项目</h1>

    {repositoryStore.downloading > 0 && <Loading />}

    <ScrollList
      translator={i18n}
      store={repositoryStore}
      renderList={allItems => (
        <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
          {allItems.map(item => (
            <Col as="li" key={item.id}></Col>
          ))}
        </Row>
      )}
      defaultData={list}
    />
  </Container>
));

export default ScrollListPage;
