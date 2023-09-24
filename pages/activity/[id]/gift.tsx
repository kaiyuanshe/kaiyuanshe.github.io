import { cache, compose, RouteProps, router } from 'next-ssr-middleware';
import { FC } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { LarkImage } from '../../../components/LarkImage';
import PageHead from '../../../components/Layout/PageHead';
import { MemberTitle } from '../../../components/Member/Title';
import { Activity, ActivityModel } from '../../../models/Activity';
import { GiftModel } from '../../../models/Activity/Gift';

interface GiftListPageProps extends RouteProps<{ id: string }> {
  activity: Activity;
  group: GiftModel['group'];
}

export const getServerSideProps = compose<{ id: string }, GiftListPageProps>(
  cache(),
  router,
  async ({ params: { id } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);

    const group = await activityStore.currentGift!.getGroup();

    return { props: { activity, group } as GiftListPageProps };
  },
);

const GiftListPage: FC<GiftListPageProps> = ({ activity, group }) => (
  <Container>
    <PageHead title={`礼品墙 - ${activity.name}`} />
    <h1 className="mt-5 mb-4 text-center">{activity.name} 礼品墙</h1>

    {Object.entries(group)
      .sort(([a], [b]) => +b - +a)
      .map(([score, list]) => (
        <section key={score}>
          <MemberTitle title="积分门槛" count={+score} />

          <ol className="list-unstyled d-flex flex-wrap justify-content-around text-center">
            {list.map(({ name, photo, stock }) => (
              <li key={name as string}>
                <div className="position-relative mb-3">
                  <LarkImage
                    roundedCircle
                    style={{ width: '10rem', height: '10rem' }}
                    src={photo}
                  />
                  <div className="position-absolute end-0 bottom-0 p-2">
                    <Badge bg="danger" pill>
                      {stock}
                    </Badge>
                  </div>
                </div>

                {name}
              </li>
            ))}
          </ol>
        </section>
      ))}
  </Container>
);

export default GiftListPage;
