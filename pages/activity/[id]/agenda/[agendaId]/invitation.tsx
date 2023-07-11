import { Loading, text2color } from 'idea-react';
import { observable } from 'mobx';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { QRCodeSVG } from 'qrcode.react';
import { createRef,MouseEvent, PureComponent } from 'react';
import { Badge, Container, Image } from 'react-bootstrap';

import { AgendaPeople } from '../../../../../components/Activity/Agenda/People';
import PageHead from '../../../../../components/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Agenda';
import { API_Host, blobURLOf, isServer } from '../../../../../models/Base';
import systemStore from '../../../../../models/System';
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
    props: JSON.parse(JSON.stringify({ activity, agenda })),
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
    globalThis.addEventListener?.('resize', this.generateImage);
  }

  componentWillUnmount() {
    globalThis.removeEventListener?.('resize', this.generateImage);
  }

  generateImage = async () => {
    if (this.imageDataURL) {
      URL.revokeObjectURL(this.imageDataURL);
      this.imageDataURL = '';
    }
    this.imageDataURL = await systemStore.convertToImageURI(
      this.elementRef.current!,
    );
  };

  share = (event: MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();

    const { title, summary } = this.props.agenda;

    navigator.share?.({
      title: title as string,
      text: summary as string,
      url: this.sharedURL,
    });
  };

  renderContent() {
    const { activity, agenda } = this.props,
      { sharedURL } = this;
    const { name, city, location } = activity,
      {
        type,
        startTime,
        endTime,
        title,
        mentors,
        mentorAvatars,
        mentorPositions,
      } = agenda;

    return (
      <>
        <PageHead title={`${title} - ${name}`} />

        <header className="d-flex flex-column align-items-center gap-4">
          <h1>{name}</h1>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>🏙{city}</li>
            <li>🗺{location}</li>
          </ul>
        </header>
        <section className="d-flex flex-column align-items-center gap-4">
          <h2 className="d-flex align-items-center gap-2">
            <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>

            {title}
          </h2>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>
              <AgendaPeople
                names={mentors as string[]}
                avatars={(mentorAvatars as TableCellValue[]).map(file =>
                  blobURLOf([file] as TableCellValue),
                )}
                positions={mentorPositions as string[]}
                summaries={[]}
              />
            </li>
            <li>
              🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
              {new Date(+endTime!).toLocaleString()}
            </li>
          </ul>
        </section>
        <footer className="d-flex flex-column align-items-center gap-4">
          {!isServer() && <QRCodeSVG value={sharedURL} />}

          <div>{t('press_to_share')}</div>
        </footer>
      </>
    );
  }

  render() {
    const { image, cardImage } = this.props.activity,
      { elementRef, imageDataURL } = this,
      { uploading } = systemStore;

    return (
      <>
        {uploading > 0 && <Loading />}

        <Container
          ref={elementRef}
          className={`d-flex flex-column justify-content-around align-items-center text-center position-relative ${styles.invitationBG}`}
          style={{
            backgroundImage: `url(${fileURLOf(cardImage || image)})`,
          }}
          onMouseEnter={imageDataURL ? undefined : this.generateImage}
          onTouchStart={imageDataURL ? undefined : this.generateImage}
        >
          {this.renderContent()}

          {imageDataURL && (
            <Image
              className="position-absolute start-0 top-0 w-100 h-100"
              fluid
              src={imageDataURL}
              alt="shareQRcode"
              onClick={this.share}
            />
          )}
        </Container>
      </>
    );
  }
}
