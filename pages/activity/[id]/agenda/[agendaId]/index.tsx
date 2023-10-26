import { text2color } from 'idea-react';
import { marked } from 'marked';
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
import {
  Badge,
  Breadcrumb,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';
import { buildURLData } from 'web-utility';

import {
  ActivityPeople,
  AgendaCard,
  AgendaToolbar,
  CheckConfirm,
  FileList,
} from '../../../../../components/Activity';
import { CommentBox } from '../../../../../components/Base/CommentBox';
import { QRCodeButton } from '../../../../../components/Base/QRCodeButton';
import { ScoreBar } from '../../../../../components/Base/ScoreBar';
import PageHead from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import { CheckEventModel } from '../../../../../models/Activity/CheckEvent';
import { API_Host, blobURLOf } from '../../../../../models/Base';
import systemStore from '../../../../../models/Base/System';
import { i18n } from '../../../../../models/Base/Translation';
import userStore from '../../../../../models/Base/User';

const SessionBox = dynamic(
    () => import('../../../../../components/Layout/SessionBox'),
    { ssr: false },
  ),
  { t } = i18n;

type PageParameter = Record<'id' | 'agendaId', string>;

interface AgendaDetailPageProps extends RouteProps<PageParameter> {
  activity: Activity;
  agenda: Agenda;
  recommendList: Agenda[];
  score: number;
}

export const getServerSideProps = compose<PageParameter, AgendaDetailPageProps>(
  cache(),
  router,
  errorLogger,
  translator(i18n),
  async ({ params: { id, agendaId } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);
    const { currentAgenda, currentEvaluation } = activityStore;

    const agenda = await currentAgenda!.getOne(agendaId!);
    await currentEvaluation!.getAll({ agenda: agenda.title });

    const { recommendList } = activityStore.currentAgenda!;

    return {
      props: JSON.parse(
        JSON.stringify({
          activity,
          agenda,
          recommendList,
          score: currentEvaluation!.currentScore,
        }),
      ),
    };
  },
);

@observer
export default class AgendaDetailPage extends PureComponent<AgendaDetailPageProps> {
  activityStore = new ActivityModel();
  checkEventStore = new CheckEventModel();

  componentDidMount() {
    const { activity, agenda } = this.props;

    this.checkEventStore.getUserCount({
      activityId: activity.id as string,
      agendaId: agenda.id as string,
    });

    this.activityStore.getOne(activity.id as string, true);
  }

  renderHeader() {
    const { user } = systemStore.hashQuery,
      { id, name, location } = this.props.activity,
      {
        id: agendaId,
        type,
        forum,
        title,
        startTime,
        endTime,
      } = this.props.agenda,
      { evaluationForms } = this.activityStore.currentMeta,
      [checkEvent] = this.checkEventStore.allItems,
      { mobilePhone } = userStore.session || {};

    return (
      <header>
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <h1>{title as string}</h1>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 my-3">
          <Badge bg={text2color(type + '', ['light'])}>{type + ''}</Badge>

          <div className="text-success">{forum as string}</div>
          <div>
            🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
            {new Date(+endTime!).toLocaleString()}
          </div>
        </div>

        <AgendaToolbar
          className="my-3 text-nowrap"
          activityId={id + ''}
          {...this.props.agenda}
        >
          <SessionBox>
            <QRCodeButton
              title="请该打卡点工作人员扫码"
              value={`${API_Host}/activity/${id}/agenda/${agendaId}#?user=${userStore.session?.id}`}
              disabled={!!checkEvent}
            >
              打卡
            </QRCodeButton>
          </SessionBox>

          {evaluationForms && (
            <DropdownButton variant="warning" size="sm" title="评价问卷">
              {evaluationForms.map(({ name, shared_url }) => (
                <Dropdown.Item
                  key={name}
                  as="a"
                  target="_blank"
                  href={`${shared_url}?${buildURLData({
                    prefill_phone: mobilePhone,
                    prefill_agenda: title,
                  })}`}
                >
                  {name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          )}
          {user && (
            <CheckConfirm
              store={this.checkEventStore}
              user={+user}
              activityId={id as string}
              activityName={name as string}
              agendaId={agendaId as string}
              agendaTitle={title as string}
            />
          )}
        </AgendaToolbar>
      </header>
    );
  }

  render() {
    const { id, alias, name, location } = this.props.activity,
      { score, recommendList } = this.props;
    const {
      title,
      fileInfo,
      mentors,
      mentorAvatars,
      mentorPositions,
      mentorOrganizations,
      mentorSummaries,
      summary = t('no_data'),
    } = this.props.agenda;

    return (
      <Container className="pt-5">
        <PageHead title={`${title} - ${name}`} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/activity">{t('activity')}</Breadcrumb.Item>
          <Breadcrumb.Item href={`/activity/${alias || id}`}>
            {name as string}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{title as string}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="my-3">
          <Col xs={12} lg={8}>
            {this.renderHeader()}
          </Col>
          <Col xs={12} lg={4}>
            <ActivityPeople
              size={5}
              names={mentors as string[]}
              avatars={(mentorAvatars as TableCellValue[]).map(file =>
                blobURLOf([file] as TableCellValue),
              )}
              positions={mentorPositions as string[]}
              organizations={mentorOrganizations as string[]}
              summaries={mentorSummaries as string[]}
            />
            <section id="score">
              <h2>{t('attendee_ratings')}</h2>
              <ScoreBar value={score} />
            </section>
          </Col>
          <Col xs={12} lg={8}>
            <main
              className="my-4"
              dangerouslySetInnerHTML={{ __html: marked(summary + '') }}
            />
            {fileInfo && <FileList data={fileInfo} />}

            <div className="my-5">
              <CommentBox
                category="General"
                categoryId="DIC_kwDOB88JLM4COLSV"
              />
            </div>
          </Col>
          {recommendList[0] && (
            <Col xs={12} lg={4} as="section" id="related_agenda">
              <h2 className="my-3">{t('related_agenda')}</h2>

              <ol className="list-unstyled d-flex flex-column gap-4">
                {recommendList.map(
                  agenda =>
                    agenda.title !== title && (
                      <li key={agenda.id + ''}>
                        <AgendaCard activityId={id + ''} {...agenda} />
                      </li>
                    ),
                )}
              </ol>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}
