import html2canvas from 'html2canvas';
import { Loading } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { QRCodeSVG } from 'qrcode.react';
import { createRef,PureComponent } from 'react';
import { Container, Image } from 'react-bootstrap';

import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import { API_Host, isServer } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Translation';
import { fileURLOf } from '../../../../api/lark/file/[id]';
import styles from './invitation.module.less';

const { t } = i18n;

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
export default class InvitationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  elementRef = createRef<HTMLDivElement>();

  sharedURL = `${API_Host}/activity/${this.props.activity.id}/agenda/${this.props.agenda.id}`;

  @observable
  imageDataURL = '';

  componentDidMount() {
    if (!isServer()) this.generateImage();
  }

  share = () => {
    const { title, summary } = this.props.agenda;

    navigator.share?.({
      title: title as string,
      text: summary as string,
      url: this.sharedURL,
    });
  };

  generateImage = async () => {
    const canvas = await html2canvas(this.elementRef.current!);

    this.imageDataURL = await new Promise<string>((resolve, reject) =>
      canvas.toBlob(
        blob => (blob ? resolve(URL.createObjectURL(blob)) : reject()),
        'image/jpeg',
        0.92,
      ),
    );
  };

  renderContent() {
    const { activity, agenda } = this.props,
      { sharedURL } = this;
    const { name, city, location } = activity,
      { startTime, endTime, title, mentors } = agenda;

    return (
      <>
        <header className="d-flex flex-column align-items-center gap-4">
          <h1>{name}</h1>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>🏙{city}</li>
            <li>🗺{location}</li>
          </ul>
        </header>
        <section className="d-flex flex-column align-items-center gap-4">
          <h2>{title}</h2>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>👨‍🎓 {(mentors as string[]).join(' ')}</li>
            <li>
              🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
              {new Date(+endTime!).toLocaleString()}
            </li>
          </ul>
        </section>
        <footer className="d-flex flex-column align-items-center gap-4">
          <QRCodeSVG value={sharedURL} />

          <div>{t('press_to_share')}</div>
        </footer>
      </>
    );
  }

  render() {
    const { image, cardImage } = this.props.activity,
      { elementRef, imageDataURL } = this;

    return (
      <>
        {!imageDataURL && <Loading />}

        <Container
          ref={elementRef}
          className={`d-flex flex-column justify-content-around align-items-center text-center position-relative ${styles.invitationBG}`}
          style={{
            backgroundImage: `url(${fileURLOf(cardImage || image)})`,
          }}
        >
          {!imageDataURL ? (
            this.renderContent()
          ) : (
            <div
              className="position-absolute start-0 top-0 w-100 h-100"
              onClick={this.share}
            >
              <Image fluid src={imageDataURL} alt="shareQRcode" />
            </div>
          )}
        </Container>
      </>
    );
  }
}
