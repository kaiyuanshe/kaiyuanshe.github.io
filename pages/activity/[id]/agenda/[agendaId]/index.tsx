import { observer } from 'mobx-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { PureComponent } from 'react';
import { Badge } from 'react-bootstrap';

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
    const { forum, title, mentors, startTime, endTime } = this.props.agenda;

    const mentorPosition: any = this.props.agenda.mentorPosition;
    const mentorPositionList = mentorPosition
      ? mentorPosition[0]?.text.split(',')
      : [];

    return (
      <div className="p-5">
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
        {/* <iframe className='rounded my-4 mw-100' src="//player.bilibili.com/player.html?aid=436167128&bvid=BV1i341197qa&cid=990587486&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
        <main>
          会议内容
        </main> */}
      </div>
    );
  }
}
