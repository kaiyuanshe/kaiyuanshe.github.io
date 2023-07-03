import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { FC, useRef, useState, useEffect } from 'react';

import { QRCodeSVG } from 'qrcode.react';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';
import { TableCellAttachment } from 'mobx-lark';
import html2canvas from 'html2canvas';

import { DefaultImage } from '../../../../api/lark/file/[id]';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import PageHead from '../../../../../components/PageHead';
import { withRoute } from '../../../../api/base';
import { isServer } from '../../../../../models/Base';
import styles from '../../../../../styles/invitation.module.less';

const VercelHost = process.env.VERCEL_URL;
const API_Host = isServer()
  ? VercelHost
    ? `https://${VercelHost}`
    : 'http://192.168.2.114:3000'
  : globalThis.location.origin;

export const getServerSideProps: GetServerSideProps<
  { activity: Activity; agenda: Agenda },
  { id: string; agendaId: string },
  { currentUrl: string }
> = async ({ resolvedUrl, params }) => {
  const activityStore = new ActivityModel();
  const { id, agendaId } = params!;
  const activity = await activityStore.getOne(id + '');
  const agenda = await activityStore.currentAgenda!.getOne(agendaId + '');
  const currentUrl = API_Host + resolvedUrl;
  return {
    props: {
      activity,
      agenda,
      currentUrl,
    },
  };
};

const Invitation: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ activity, agenda, currentUrl }) => {
  const elementRef = useRef(null);
  const [imageDataURL, setImageDataURL] = useState<string | null>(null);

  useEffect(() => {
    generateImage();
  }, []);

  console.log('activity.id', activity);
  console.log('agenda', agenda);
  const { name, city, location } = activity;
  const { startTime, endTime, title, mentors } = agenda;
  // const currentUrl =  withRoute.asPath;
  console.log('currentUrl', currentUrl);
  const shareURL = async () => {
    try {
      await navigator.share?.({
        title: 'web.dev',
        text: 'Check out web.dev.',
        url: 'https://web.dev/',
      });
      console.log('share success');
    } catch (error) {
      console.log('share error', error);
    }
  };

  const generateImage = () => {
    const element = elementRef.current;

    html2canvas(element!).then(canvas => {
      const image = canvas.toDataURL('image/jpeg', 0.92);
      setImageDataURL(image as string);
      // 在这里可以使用生成的图片数据
      //console.log(image);
    });
  };

  return (
    <Container className={styles.invitationBG} id="shareImg" ref={elementRef}>
      {!imageDataURL && (
        <ul style={{ listStyle: 'none' }}>
          <li>{name}</li>
          <li>{city}</li>
          <li>{location}</li>
          <li>
            🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
            {new Date(+endTime!).toLocaleString()}
          </li>
          <li>{title}</li>
          <li>👨‍🎓 {(mentors as string[]).join(' ')}</li>
          <li>
            <QRCodeSVG value={currentUrl} />
          </li>
        </ul>
      )}

      {imageDataURL && (
        <div style={{}}>
          <Image src={imageDataURL} alt="Generated" className="img-fluid" />
        </div>
      )}
    </Container>
  );
};

export default Invitation;
