import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { TableCellAttachment } from 'mobx-lark';

import { DefaultImage } from '../../../../api/lark/file/[id]';

import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import PageHead from '../../../../../components/PageHead';
import { blobURLOf } from '../../../../../models/Base';

import styles from '../../../../../styles/invitation.module.less';

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
  console.log('activity.id', activity);
  console.log('agenda', agenda);
  return (
    <Container className={styles.invitationBG}>
      <h1>{activity.name}</h1>
      <h2>{activity.city}</h2>
      <h2>{activity.location}</h2>

      <h2>
        🕒 {new Date(+agenda.startTime!).toLocaleString()} ~{' '}
        {new Date(+agenda.endTime!).toLocaleString()}
      </h2>
      <h3>{agenda.title}</h3>

      <div className="d-flex">
        {(agenda.mentorAvatars as unknown as TableCellAttachment[])?.map(
          file => (
            <Card.Img
              key={file.attachmentToken}
              className="object-fit-cover"
              style={{ height: '20rem' }}
              loading="lazy"
              src={blobURLOf([file])}
            />
          ),
        )}
      </div>
      <h3>👨‍🎓 {(agenda.mentors as string[]).join(' ')}</h3>
    </Container>
  );
};

export default Invitation;
