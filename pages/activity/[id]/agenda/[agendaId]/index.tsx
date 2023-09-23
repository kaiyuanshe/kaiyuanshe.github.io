import { SpinnerButton, text2color } from 'idea-react';
import {
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Col, Container, Row } from 'react-bootstrap';

import { AgendaToolbar } from '../../../../../components/Activity/Agenda/Toolbar';
import { ActivityPeople } from '../../../../../components/Activity/People';
import { CommentBox } from '../../../../../components/CommentBox';
import PageHead from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import { CheckEventModel } from '../../../../../models/Activity/CheckEvent';
import { blobURLOf } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Base/Translation';
import userStore from '../../../../../models/Base/User';

const SessionBox = dynamic(
  () => import('../../../../../components/Layout/SessionBox'),
  { ssr: false },
);

type PageParameter = Record<'id' | 'agendaId', string>;

interface AgendaDetailPageProps extends RouteProps<PageParameter> {
  activity: Activity;
  agenda: Agenda;
}

export const getServerSideProps = compose<PageParameter, AgendaDetailPageProps>(
  cache(),
  router,
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const activityStore = new ActivityModel(),
      { id, agendaId } = params!;
    const activity = await activityStore.getOne(id + ''),
      agenda = await activityStore.currentAgenda!.getOne(agendaId + '');

    return {
      props: JSON.parse(JSON.stringify({ activity, agenda })),
    };
  },
);

const { t } = i18n;

@observer
export default class AgendaDetailPage extends PureComponent<AgendaDetailPageProps> {
  constructor(props: AgendaDetailPageProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  activityStore?: ActivityModel = undefined;

  @observable
  checkEventStore?: CheckEventModel = undefined;

  @computed
  get loading() {
    const { downloading = 0, currentAgenda } = this.activityStore || {},
      { uploading = 0 } = this.checkEventStore || {};
    const { downloading: aDownloading = 0 } = currentAgenda || {};

    return downloading > 0 || aDownloading > 0 || uploading > 0;
  }

  private disposer?: IReactionDisposer;

  componentDidMount() {
    this.checkEventStore = new CheckEventModel();

    if (this.props.route.query.mobilePhone) this.checkAuthorization();

    this.disposer = reaction(() => userStore.session, this.checkAuthorization);
  }

  componentWillUnmount() {
    this.disposer?.();
  }

  checkAuthorization = async () => {
    const { session } = userStore,
      { activity, agenda } = this.props;

    if (!session) return;

    this.activityStore ||= new ActivityModel();

    await this.activityStore.getOne(activity.id as string);

    return this.activityStore.currentAgenda!.checkAuthorization(
      agenda.title as string,
      session.mobilePhone,
    );
  };

  renderConfirmButton() {
    const { props, loading } = this;
    const { mobilePhone } = props.route.query,
      { activity, agenda } = props,
      { currentAuthorized } = this.activityStore?.currentAgenda || {};

    return (
      mobilePhone && (
        <SessionBox>
          <SpinnerButton
            size="sm"
            variant="danger"
            loading={loading}
            disabled={!currentAuthorized}
            onClick={() =>
              this.checkEventStore?.updateOne({
                activityId: activity.id as string,
                activityName: activity.name as string,
                agendaId: agenda.id as string,
                agendaTitle: agenda.title as string,
              })
            }
          >
            确认打卡
          </SpinnerButton>
        </SessionBox>
      )
    );
  }

  renderHeader() {
    const { id, location } = this.props.activity,
      { type, forum, title, startTime, endTime } = this.props.agenda;

    return (
      <header>
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <h1>{title}</h1>

          <AgendaToolbar
            className="my-3 text-nowrap"
            activityId={id + ''}
            location={location + ''}
            {...this.props.agenda}
          >
            {this.renderConfirmButton()}
          </AgendaToolbar>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>

          <div className="text-success">{forum}</div>
          <div>
            🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
            {new Date(+endTime!).toLocaleString()}
          </div>
        </div>
      </header>
    );
  }

  render() {
    const { name } = this.props.activity;
    const {
      title,
      mentors,
      mentorAvatars,
      mentorPositions,
      mentorSummaries,
      summary = t('no_data'),
    } = this.props.agenda;

    return (
      <Container className="pt-5">
        <PageHead title={`${title} - ${name}`} />

        <Row>
          <Col xs={12} sm={9}>
            {this.renderHeader()}

            <main className="my-2">{summary}</main>
          </Col>
          <Col xs={12} sm={3}>
            <ActivityPeople
              names={mentors as string[]}
              avatars={(mentorAvatars as TableCellValue[]).map(file =>
                blobURLOf([file] as TableCellValue),
              )}
              positions={mentorPositions as string[]}
              summaries={mentorSummaries as string[]}
            />
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
