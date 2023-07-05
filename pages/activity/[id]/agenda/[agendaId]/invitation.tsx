import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { FC, useRef, useState, useEffect } from 'react';

import { QRCodeSVG } from 'qrcode.react';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { TableCellAttachment } from 'mobx-lark';
import html2canvas from 'html2canvas';

import { DefaultImage } from '../../../../api/lark/file/[id]';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import PageHead from '../../../../../components/PageHead';
import { withRoute } from '../../../../api/base';
import { API_Host } from '../../../../../models/Base';
import styles from '../../../../../styles/invitation.module.less';

export const getServerSideProps: GetServerSideProps<
  { activity: Activity; agenda: Agenda; currentUrl: string },
  { id: string; agendaId: string }
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
  const elementRef = useRef<HTMLDivElement>(null);
  const [imageDataURL, setImageDataURL] = useState('');

  useEffect(() => {
    generateImage();
  }, []);

  console.log('activity.id', activity);
  console.log('agenda', agenda);
  const { name, city, location } = activity;
  const { startTime, endTime, title, mentors } = agenda;
  // const currentUrl =  withRoute.asPath;
  console.log('currentUrl', currentUrl);
  const share = async () => {
    try {
      await navigator.share?.({
        title: '开源社',
        text: '邀请函',
        url: currentUrl,
      });
      console.log('share success');
    } catch (error) {
      console.log('share error', error);
    }
  };

  const generateImage = async () => {
    const element = elementRef.current;

    try {
      const canvas = await html2canvas(element!);
      const image = canvas.toDataURL('image/jpeg', 0.92);
      setImageDataURL(image as string);
      console.log('image run finish');
      const tempUrl = window.location.href;
      console.log('tempUrl', tempUrl);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getURL = () => {
    return window.location.href;
  };

  return (
    <>
      {!imageDataURL && <Loading />}
      <Container className={styles.invitationBG} ref={elementRef}>
        {!imageDataURL ? (
          <ul className="list-unstyled">
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
            <li>长按图片分享</li>
          </ul>
        ) : (
          <div className={styles.invitationImage} onClick={share}>
            <Image src={imageDataURL} alt="Generated" className="img-fluid" />
          </div>
        )}
      </Container>
    </>
  );
};

export default Invitation;
