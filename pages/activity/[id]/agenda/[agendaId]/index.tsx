import { observer } from 'mobx-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { PureComponent } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { CommentBox } from '../../../../../components/CommentBox';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';

export const getServerSideProps: GetServerSideProps<
  { activity: Activity; agenda: Agenda },
  { id: string; agendaId: string }
> = async ({ params }) => {
  const activityStore = new ActivityModel(),
    { id, agendaId } = params!;
  const activity = await activityStore.getOne(id + ''),
    agenda = await activityStore.currentAgenda!.getOne(agendaId + '');

  return {
    props: { activity, agenda },
  };
};

@observer
export default class AgendaDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const {
      forum,
      title,
      mentors,
      startTime,
      endTime,
      summary = '暂无内容',
    } = this.props.agenda;

    const mentorPosition: any = this.props.agenda.mentorPosition;
    const mentorPositionList = mentorPosition
      ? mentorPosition[0]?.text.split(',')
      : [];

    return (
      <Container className="pt-3">
        <header>
          <div className="text-end text-success">{forum}</div>
          <h2>{title}</h2>
          <span>{mentors}</span>
          {mentorPositionList.map((position: string) => (
            <Badge key={position} bg="dark" className="mx-2">
              {position}
            </Badge>
          ))}
          <div>
            🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
            {new Date(+endTime!).toLocaleString()}
          </div>
        </header>
        <main className="my-2">{summary}</main>
        <footer>
          <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
        </footer>
      </Container>
    );
  }
}
