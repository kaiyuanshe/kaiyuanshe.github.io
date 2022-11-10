import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ArticleCard } from '../../components/ArticleCard';
import { isServer } from '../../models/Base';
import articleStore from '../../models/Article';
import PageHead from '../../components/PageHead';

export async function getServerSideProps() {
  const list = await articleStore.getList();

  return { props: { list } };
}

@observer
export default class ArticleListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  async componentDidMount() {
    if (isServer()) return;

    articleStore.clear();

    await articleStore.restoreList({ allItems: this.props.list });
  }

  render() {
    const { allItems } = articleStore;

    return (
      <Container className="py-5">
        <PageHead title="开源文库" />

        <h1 className="mb-5 text-center">开源文库</h1>

        <Row as="ul" className="list-unstyled" xs={1} sm={2} md={3}>
          {allItems.map(item => (
            <Col as="li" key={item.id + ''}>
              <ArticleCard {...item} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}
