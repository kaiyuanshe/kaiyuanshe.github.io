import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FC } from 'react';

import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';

export const getServerSideProps: GetServerSideProps<
  { activity: Activity; agenda: Agenda },
  { id: string; agendaId: string }
> = async context => {
  const activityStore = new ActivityModel();
  const { id, agendaId } = context.params!;
  const activity = await activityStore.getOne(id + '');
  const agenda = await activityStore.currentAgenda!.getOne(agendaId + '');

  return {
    props: {
      activity,
      agenda,
    },
  };
};

const Invitation: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ activity, agenda }) => {
  return (
    <div>
      <h1>Invitation Page</h1>
      <p>Activity ID: {activity.id}</p>
      <p>Agenda ID: {agenda.id}</p>
    </div>
  );
};

export default Invitation;
