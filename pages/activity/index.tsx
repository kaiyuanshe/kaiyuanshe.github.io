import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ActivityCard } from '../../components/ActivityCard';
import { isServer } from '../../models/Base';
import activityStore from '../../models/Activity';
import PageHead from '../../components/PageHead';

export async function getServerSideProps() {
  const list = await activityStore.getList({}, 1);

  return { props: { list } };
}

@observer
export default class ActivityListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  async componentDidMount() {
    if (isServer()) return;

    activityStore.clear();

    await activityStore.restoreList({ allItems: this.props.list });
  }

  render() {
    const { allItems } = activityStore;

    return (
      <Container className="py-5">
        <PageHead title="活动列表" />

        <h1 className="mb-5 text-center">活动列表</h1>

        <Row as="ul" className="list-unstyled" xs={1} sm={2} md={3}>
          {allItems.map(item => (
            <Col as="li" key={item?.id + ''}>
              <ActivityCard {...item} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}
