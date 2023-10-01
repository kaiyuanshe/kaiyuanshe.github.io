import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { cache, compose, RouteProps, router } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container, Stack } from 'react-bootstrap';

import { GiftCard } from '../../../components/Activity/GiftCard';
import { QRCodeButton } from '../../../components/Base/QRCodeButton';
import PageHead from '../../../components/Layout/PageHead';
import { MemberTitle } from '../../../components/Member/Title';
import { Activity, ActivityModel } from '../../../models/Activity';
import { CheckEventModel } from '../../../models/Activity/CheckEvent';
import { GiftModel } from '../../../models/Activity/Gift';
import userStore from '../../../models/Base/User';

const SessionBox = dynamic(
  () => import('../../../components/Layout/SessionBox'),
  { ssr: false },
);

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

@observer
export default class GiftListPage extends PureComponent<GiftListPageProps> {
  activityStore = new ActivityModel();
  checkEventStore = new CheckEventModel();

  @computed
  get loading() {
    return (
      this.checkEventStore.downloading > 0 ||
      (this.activityStore.currentEvaluation?.downloading || 0) > 0
    );
  }

  @computed
  get sumScore() {
    return (
      this.checkEventStore.allItems.length +
      (this.activityStore.currentEvaluation?.allItems.length || 0)
    );
  }

  async componentDidMount() {
    this.checkEventStore.getUserCount({
      activityId: this.props.activity.id as string,
    });
    await this.activityStore.getOne(this.props.activity.id as string);

    this.activityStore.currentEvaluation!.getUserCount();
  }

  renderSessionBar() {
    const { mobilePhone } = userStore.session || {},
      { sumScore } = this;

    return (
      mobilePhone && (
        <Stack
          className="justify-content-center position-relative z-1"
          direction="horizontal"
          gap={3}
        >
          <div>
            可用积分：<strong className="text-danger">{sumScore}</strong>
          </div>

          <SessionBox>
            <QRCodeButton
              title="请礼品墙工作人员扫码"
              value={[mobilePhone, sumScore] + ''}
            >
              兑换
            </QRCodeButton>
          </SessionBox>
        </Stack>
      )
    );
  }

  render() {
    const { activity, group } = this.props,
      { session } = userStore,
      { loading, sumScore } = this;

    return (
      <Container>
        <PageHead title={`礼品墙 - ${activity.name}`} />
        <h1 className="mt-5 mb-4 text-center">{activity.name} 礼品墙</h1>

        {loading && <Loading />}

        {this.renderSessionBar()}

        {Object.entries(group)
          .sort(([a], [b]) => +b - +a)
          .map(([score, list]) => (
            <section key={score}>
              <MemberTitle title="积分门槛" count={+score} />

              <ol className="list-unstyled d-flex flex-wrap justify-content-around text-center">
                {list.map(gift => (
                  <li key={gift.name as string}>
                    <GiftCard
                      {...gift}
                      disabled={!gift.stock || (session && sumScore < +score)}
                    />
                  </li>
                ))}
              </ol>
            </section>
          ))}
      </Container>
    );
  }
}
