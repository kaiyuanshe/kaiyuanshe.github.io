import { text2color } from 'idea-react';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
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
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';
import { buildURLData } from 'web-utility';

import { AgendaCard } from '../../../../../components/Activity/Agenda/Card';
import { FileList } from '../../../../../components/Activity/Agenda/FileList';
import { AgendaToolbar } from '../../../../../components/Activity/Agenda/Toolbar';
import { CheckConfirm } from '../../../../../components/Activity/CheckConfirm';
import { ActivityPeople } from '../../../../../components/Activity/People';
import { CommentBox } from '../../../../../components/Base/CommentBox';
import { ScoreBar } from '../../../../../components/Base/ScoreBar';
import PageHead from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import { CheckEventModel } from '../../../../../models/Activity/CheckEvent';
import { blobURLOf } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Base/Translation';
import userStore from '../../../../../models/Base/User';

type PageParameter = Record<'id' | 'agendaId', string>;

interface AgendaDetailPageProps extends RouteProps<PageParameter> {
  activity: Activity;
  agenda: Agenda;
  recommends: Agenda[];
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

    const recommends =
      activityStore.currentAgenda!.currentRecommend!.currentPage;

    return {
      props: JSON.parse(
        JSON.stringify({
          activity,
          agenda,
          recommends,
          score: currentEvaluation!.currentScore,
        }),
      ),
    };
  },
);

const { t } = i18n;

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
    const { user } = this.props.route.query,
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
          <h1>{title}</h1>

          <AgendaToolbar
            className="my-3 text-nowrap"
            activityId={id + ''}
            location={location + ''}
            {...this.props.agenda}
            checked={!!checkEvent}
          >
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
    const { id, name, location } = this.props.activity,
      { score } = this.props;
    const {
      title,
      fileInfo,
      mentors,
      mentorAvatars,
      mentorPositions,
      mentorSummaries,
      summary = t('no_data'),
    } = this.props.agenda;
    const { recommends } = this.props;

    return (
      <Container className="pt-5">
        <PageHead title={`${title} - ${name}`} />
        <Row>
          <Col xs={12} sm={9}>
            <Row>
              <Col xs={12} sm={9}>
                {this.renderHeader()}

                <main className="my-2">{summary + ''}</main>
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
                <h2>观众评分</h2>

                <ScoreBar value={score} />
              </Col>
            </Row>

            {fileInfo && <FileList data={fileInfo} />}

            <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
          </Col>
          <Col xs={12} sm={3}>
            {recommends[0] && (
              <Row as="ol" className="list-unstyled g-4" xs={1}>
                {recommends.map(agenda => (
                  <Col as="li" key={agenda.id + ''}>
                    <AgendaCard
                      activityId={id + ''}
                      location={location + ''}
                      {...agenda}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
