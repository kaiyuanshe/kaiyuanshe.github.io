import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { AgendaPeople } from '../../../../../components/Activity/Agenda/People';
import { CommentBox } from '../../../../../components/CommentBox';
import PageHead from '../../../../../components/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import { blobURLOf } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Translation';
import { withTranslation } from '../../../../api/base';

export const getServerSideProps = withTranslation<
  { id: string; agendaId: string },
  { activity: Activity; agenda: Agenda }
>(async ({ params }) => {
  const activityStore = new ActivityModel(),
    { id, agendaId } = params!;
  const activity = await activityStore.getOne(id + ''),
    agenda = await activityStore.currentAgenda!.getOne(agendaId + '');

  return {
    props: { activity, agenda },
  };
});

const { t } = i18n;

@observer
export default class AgendaDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { id: activityId, name } = this.props.activity;
    const {
      id,
      forum,
      title,
      mentors,
      mentorAvatars,
      mentorPositions,
      mentorSummaries,
      startTime,
      endTime,
      summary = t('no_data'),
    } = this.props.agenda;

    return (
      <Container className="pt-5">
        <PageHead title={`${title} - ${name}`} />

        <Row>
          <Col xs={12} sm={9}>
            <header>
              <div className="d-flex align-items-center justify-content-between">
                <h1>{title}</h1>
                <Button
                  size="sm"
                  variant="warning"
                  href={`/activity/${activityId}/agenda/${id}/invitation`}
                >
                  {t('share')}
                </Button>
              </div>
              <div className="d-flex gap-3">
                <div className="text-success">{forum}</div>
                <div>
                  🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
                  {new Date(+endTime!).toLocaleString()}
                </div>
              </div>
            </header>
            <main className="my-2">{summary}</main>
          </Col>
          <Col xs={12} sm={3}>
            <AgendaPeople
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
