import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { FC } from 'react';

import { QRCodeSVG } from 'qrcode.react';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';
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

  const shareURL = async () => {
    console.log('shareURL');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'web.dev',
          text: 'Check out web.dev.',
          url: 'https://web.dev/',
        });
        console.log('share success');
      } catch (error) {
        console.log('share error', error);
      }
    } else {
      console.log('share fail');
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container className={styles.invitationBG}>
        <h1>{activity.name}</h1>
        <h2>{activity.city}</h2>
        <h2>{activity.location}</h2>
        <h2>
          🕒 {new Date(+agenda.startTime!).toLocaleString()} ~{' '}
          {new Date(+agenda.endTime!).toLocaleString()}
        </h2>
        <h3>{agenda.title}</h3>
        <h3>👨‍🎓 {(agenda.mentors as string[]).join(' ')}</h3>
        <QRCodeSVG value={globalThis.location?.href} />
      </Container>
    </>
  );
};

export default Invitation;
