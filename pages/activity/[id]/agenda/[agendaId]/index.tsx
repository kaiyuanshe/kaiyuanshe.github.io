import { text2color } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import {
  cache,
  compose,
  errorLogger,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';

import { AgendaToolbar } from '../../../../../components/Activity/Agenda/Toolbar';
import { ActivityPeople } from '../../../../../components/Activity/People';
import { CommentBox } from '../../../../../components/CommentBox';
import PageHead from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import {
  AgendaFile,
  AgendaFileModel,
} from '../../../../../models/Activity/AgendaFile';
import { blobURLOf } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Base/Translation';

interface AgendaDetailPageProps {
  activity: Activity;
  agenda: Agenda;
  fileList: AgendaFile[];
}

export const getServerSideProps = compose<
  { id: string; agendaId: string },
  AgendaDetailPageProps
>(router, errorLogger, translator(i18n), async ({ params }) => {
  const activityStore = new ActivityModel(),
    { id, agendaId } = params!;
  const activity = await activityStore.getOne(id + ''),
    agenda = await activityStore.currentAgenda!.getOne(agendaId + '');

  const fileList = await new AgendaFileModel().getAll();

  return {
    props: JSON.parse(JSON.stringify({ activity, agenda, fileList })),
  };
});

const { t } = i18n;

@observer
export default class AgendaDetailPage extends PureComponent<AgendaDetailPageProps> {
  constructor(props: AgendaDetailPageProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  activityStore?: ActivityModel = undefined;

  async componentDidMount() {
    const { activity, agenda } = this.props;

    this.activityStore = new ActivityModel();

    await this.activityStore.getOne(activity.id as string);

    this.activityStore.currentAgenda!.checkAuthorization(
      agenda.title as string,
      '13800000000',
    );
  }

  renderHeader() {
    const { id, location } = this.props.activity;
    const { type, forum, title, startTime, endTime } = this.props.agenda;

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
            {this.activityStore?.currentAgenda?.currentAuthorized && (
              <Button size="sm" variant="danger">
                确认打卡
              </Button>
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
    const { name } = this.props.activity;
    const {
      title,
      mentors,
      mentorAvatars,
      mentorPositions,
      mentorSummaries,
      summary = t('no_data'),
      files,
    } = this.props.agenda;
    if (1 == 1) {
      debugger;
    }

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
