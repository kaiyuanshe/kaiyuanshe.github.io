import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { FC, useEffect, useRef, useState } from 'react';

import html2canvas from 'html2canvas';
import { Loading } from 'idea-react';
import { QRCodeSVG } from 'qrcode.react';
import { Container, Image } from 'react-bootstrap';

import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import { API_Host } from '../../../../../models/Base';
import styles from './invitation.module.less';

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

  const { name, city, location } = activity;
  const { startTime, endTime, title, mentors } = agenda;

  const share = async () => {
    try {
      await navigator.share?.({
        title: '开源社',
        text: '邀请函',
        url: currentUrl,
      });
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
