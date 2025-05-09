import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Breadcrumb, Container, Stack } from 'react-bootstrap';

import { GiftCard } from '../../../components/Activity/GiftCard';
import { QRCodeButton } from '../../../components/Base/QRCodeButton';
import { PageHead } from '../../../components/Layout/PageHead';
import { MemberTitle } from '../../../components/Member/Title';
import { Activity, ActivityModel } from '../../../models/Activity';
import { CheckEventModel } from '../../../models/Activity/CheckEvent';
import { GiftModel } from '../../../models/Activity/Gift';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';
import { solidCache } from '../../api/base';

const SessionBox = dynamic(() => import('../../../components/Layout/SessionBox'), { ssr: false });

interface GiftListPageProps extends RouteProps<{ id: string }> {
  activity: Activity;
  group: GiftModel['group'];
}

export const getServerSideProps = compose<{ id: string }, GiftListPageProps>(
  solidCache,
  router,
  async ({ params: { id } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);

    const group = await activityStore.currentGift!.getGroup();

    return { props: { activity, group } as GiftListPageProps };
  },
);

@observer
export default class GiftListPage extends ObservedComponent<GiftListPageProps, typeof i18n> {
  static contextType = I18nContext;

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
    const { t } = this.observedContext,
      { mobilePhone } = userStore.session || {},
      { sumScore } = this;

    return (
      mobilePhone && (
        <Stack
          className="justify-content-center position-relative z-1"
          direction="horizontal"
          gap={3}
        >
          <div>
            {t('available_score')} <strong className="text-danger">{sumScore}</strong>
          </div>

          <SessionBox>
            <QRCodeButton title={t('exchange_tips')} value={[mobilePhone, sumScore] + ''}>
              {t('exchange')}
            </QRCodeButton>
          </SessionBox>
        </Stack>
      )
    );
  }

  render() {
    const { t } = this.observedContext,
      { activity, group } = this.props,
      { session } = userStore,
      { loading, sumScore } = this;

    return (
      <Container>
        <PageHead title={`${t('gift_wall')} - ${activity.name}`} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/activity">{t('activity')}</Breadcrumb.Item>
          <Breadcrumb.Item href={`/activity/${activity.id}`}>
            {activity.name as string}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t('gift_wall')}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="mt-5 mb-4 text-center">
          {activity.name as string} {t('gift_wall')}
        </h1>

        {loading && <Loading />}

        {this.renderSessionBar()}

        {Object.entries(group)
          .sort(([a], [b]) => +b - +a)
          .map(([score, list]) => (
            <section key={score}>
              <MemberTitle title={t('score_threshold')} count={+score} />

              <ol className="list-unstyled d-flex flex-wrap justify-content-around text-center">
                {list.map(gift => (
                  <li key={gift.name as string}>
                    <GiftCard {...gift} disabled={!gift.stock || (session && sumScore < +score)} />
                  </li>
                ))}
              </ol>
            </section>
          ))}
      </Container>
    );
  }
}
