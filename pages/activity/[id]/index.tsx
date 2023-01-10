import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageHead from '../../../components/PageHead';

import { ActivityModel } from '../../../models/Activity';
import { Agenda } from '../../../models/Agenda';
import { blobURLOf } from '../../../models/Base';
import { Activity } from '../../api/activity';
import { withTranslation } from '../../api/base';

export const getServerSideProps = withTranslation<
  { id: string },
  { activity: Activity; agendas: Agenda[] }
>(async ({ params }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(params!.id);

  const agendas = await activityStore.currentAgenda!.getAll();

  return { props: { activity, agendas } };
});

const ActivityDetailPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ activity, agendas }) => (
  <>
    <PageHead title={activity.name + ''} />

    <header
      className="d-flex flex-column align-items-center justify-content-around mb-5"
      style={{
        height: 'calc(100vh - 5rem)',
        backgroundSize: 'cover',
        backgroundImage: `url(${blobURLOf(activity.image)})`,
      }}
    >
      <h1 className="visually-hidden">{activity.name}</h1>
    </header>

    <Container>
      <Row as="ol" className="list-unstyled g-4" xs={1} sm={2} md={3}>
        {agendas.map(({ id, title, forum, mentors, startTime, endTime }) => (
          <Col as="li" key={id + ''}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{title}</Card.Title>

                <ul className="list-unstyled">
                  <li>👨‍🎓 {(mentors as string[]).join(' ')}</li>
                  <li>
                    🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
                    {new Date(+endTime!).toLocaleString()}
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </>
));

export default ActivityDetailPage;
